import Router from "@koa/router"
import { Middleware } from "koa"
import {
    finishRiddle,
    getRiddleState,
    saveRiddleState,
    startRiddle,
    updateLastSeen,
} from "./db"
import { log } from "./log"

export type StateWrapper<State> = {
    _id?: string
    user: string
    isActive: boolean
    lastUpdated: Date
    lastSeen: Date
    state: State
}
export type RiddleState<DB_STATE> = {
    active: StateWrapper<DB_STATE>
    others: Array<StateWrapper<DB_STATE>>
}
export type PhoneAction<PARAM, DB_STATE> = (
    state: RiddleState<DB_STATE>,
    param: PARAM
) => Promise<RiddleState<DB_STATE>>

export type PiAction<PARAM, DB_STATE> = (
    state: Array<StateWrapper<DB_STATE>>,
    param: PARAM
) => Promise<Array<StateWrapper<DB_STATE>>>

export function riddle<DB_STATE, API_STATE>({
    riddleId,
    start,
    solved,
    getter,
    phoneActions,
    piActions,
    tick,
    tickRateInMs,
}: {
    riddleId: string
    start: (
        existingState: Array<StateWrapper<DB_STATE>>
    ) => Promise<DB_STATE | undefined>
    solved: (state: Array<StateWrapper<DB_STATE>>) => boolean
    tick?: (
        state: Array<StateWrapper<DB_STATE>>
    ) => Promise<Array<StateWrapper<DB_STATE>>>
    tickRateInMs?: number
    getter: (state: RiddleState<DB_STATE>) => API_STATE
    phoneActions: Record<string, PhoneAction<unknown, DB_STATE>>
    piActions: Record<string, PiAction<unknown, DB_STATE>>
}): Middleware {
    const logger = log(riddleId)
    const router = new Router()

    function getApiState(state: RiddleState<DB_STATE>): API_STATE {
        return {
            ...getter(state),
            solved: solved(
                [...state.others, state.active].filter((it) => it != undefined)
            ),
        }
    }

    router.get(`/${riddleId}`, async (ctx) => {
        const state = await getRiddleState<DB_STATE>(riddleId)

        const active = state.find((s) => s.user == ctx.user)
        const others = state.filter((s) => s.user != ctx.user)

        const isSolved = solved(state)

        if (isSolved) {
            logger.info(`${ctx.user} solved the riddle`)
            setTimeout(async () => {
                state.forEach((it) => {
                    finishRiddle(riddleId, it._id)
                })
            }, 60 * 1000)
        }

        await updateLastSeen(riddleId, ctx.user)

        ctx.body = getApiState({ active, others })
    })

    for (const [actionName, action] of Object.entries(phoneActions)) {
        router.post(`/${riddleId}/${actionName}`, async (ctx) => {
            logger.debug(
                `[Phone action] ${actionName} ${JSON.stringify(
                    ctx.request.body
                )}`
            )
            const state = await getRiddleState<DB_STATE>(riddleId)
            const param = ctx.request.body

            const active = state.find((s) => s.user == ctx.user)
            if (active == undefined) {
                ctx.status = 409
                return
            }
            const others = state.filter((s) => s.user != ctx.user)

            const newState = await action({ active, others }, param)

            await saveRiddleState(riddleId, newState.active)
            for (const other of newState.others) {
                await saveRiddleState(riddleId, other)
            }

            const stateAfter = await getRiddleState<DB_STATE>(riddleId)
            const newActive = stateAfter.find((s) => s.user == ctx.user)
            const newOthers = stateAfter.filter((s) => s.user != ctx.user)
            ctx.body = getApiState({ active: newActive, others: newOthers })
        })
    }

    /** PI methods  */
    router.get(`/${riddleId}/raw-state`, async (ctx) => {
        const state = await getRiddleState<DB_STATE>(riddleId)

        ctx.body = state
    })

    for (const [actionName, action] of Object.entries(piActions)) {
        router.post(`/${riddleId}/${actionName}`, async (ctx) => {
            logger.debug(`[PI action] ${actionName}`)
            const state = await getRiddleState<DB_STATE>(riddleId)
            const param = ctx.request.body

            const newState = await action(state, param)

            for (const player of newState) {
                await saveRiddleState(riddleId, player)
            }

            ctx.body = newState
        })
    }

    /** start **/
    router.post(`/${riddleId}/start`, async (ctx) => {
        logger.debug(`[Start]`)
        const checkExisting = await getRiddleState<DB_STATE>(riddleId)

        const isSolved = solved(checkExisting)
        if (isSolved) {
            for (const player of checkExisting) {
                await finishRiddle(riddleId, player._id)
            }
        }

        const existing = await getRiddleState<DB_STATE>(riddleId)

        if (existing.some((it) => it.user === ctx.user)) {
            const active = existing.find((s) => s.user == ctx.user)
            const others = existing.filter((s) => s.user != ctx.user)
            ctx.body = getApiState({ active, others })
            return
        }

        const state = await start(existing)

        if (!state) {
            ctx.status = 409
            return
        }

        // inject user
        const wrapped = {
            user: ctx.user,
            isActive: true,
            lastUpdated: new Date(),
            lastSeen: new Date(),
            state,
        }
        await startRiddle(riddleId, wrapped)
        ctx.body = getApiState({ active: wrapped, others: existing })
    })

    // Call tick every tickRateInMs
    if (tick) {
        setInterval(async () => {
            const state = await getRiddleState<DB_STATE>(riddleId)
            const newState = await tick(state)
            for (const player of newState) {
                await saveRiddleState(riddleId, player, {
                    noUpdateLastSeen: true,
                })
            }
        }, tickRateInMs ?? 1000)
    }

    return router.routes()
}
