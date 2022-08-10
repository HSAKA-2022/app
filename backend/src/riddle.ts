import Router from "@koa/router"
import { Middleware } from "koa"
import {
    finishRiddleOnDb,
    getRiddleState,
    now,
    saveRiddleState,
    startRiddleOnDb,
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
    all: Array<StateWrapper<DB_STATE>>
}
export type PhoneAction<PARAM, DB_STATE> = (
    state: RiddleState<DB_STATE>,
    param: PARAM
) => Promise<RiddleState<DB_STATE> | undefined>

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
    const router = new Router().prefix(`/${riddleId}`)

    function getApiState(state: RiddleState<DB_STATE>): API_STATE {
        return {
            ...getter(state),
            solved: solved(
                [...state.others, state.active].filter((it) => it != undefined)
            ),
        }
    }

    router.get(`/`, async (ctx) => {
        const state = await getRiddleState<DB_STATE>(riddleId)

        const active = state.find((s) => s.user === ctx.user)
        const others = state.filter((s) => s !== active)

        const isSolved = solved(state)

        if (isSolved) {
            logger.info(`${ctx.user} solved the riddle`)
            setTimeout(async () => {
                state.forEach((it) => {
                    finishRiddleOnDb(riddleId, it._id)
                })
            }, 60 * 1000)
        }

        await updateLastSeen(riddleId, ctx.user)

        ctx.body = getApiState({ active, others, all: state })
    })

    for (const [actionName, action] of Object.entries(phoneActions)) {
        router.post(`/${actionName}`, async (ctx) => {
            logger.debug(
                `[Phone action] ${actionName} ${JSON.stringify(
                    ctx.request.body
                )}`
            )
            const state = await getRiddleState<DB_STATE>(riddleId)
            const param = ctx.request.body

            const active = state.find((s) => s.user == ctx.user)
            if (active == undefined) {
                logger.debug("[Phone action] No active state")
                ctx.status = 409
                return
            }
            const others = state.filter((s) => s.user != ctx.user)

            logger.debug("Executing action")
            const newState = await action({ active, others, all: state }, param)

            if (newState != undefined) {
                logger.debug("saving new state")
                await saveRiddleState(riddleId, newState.active)
                await Promise.all(
                    newState.others.map((it) => saveRiddleState(riddleId, it))
                )
                logger.debug("done saving")
            }
            logger.debug("returning state")
            const stateAfter = await getRiddleState<DB_STATE>(riddleId)
            const newActive = stateAfter.find((s) => s.user == ctx.user)
            const newOthers = stateAfter.filter((s) => s.user != ctx.user)
            ctx.body = getApiState({
                active: newActive,
                others: newOthers,
                all: stateAfter,
            })
            logger.debug("[action] done")
        })
    }

    /** PI methods  */
    router.get(`/raw-state`, async (ctx) => {
        const state = await getRiddleState<DB_STATE>(riddleId)

        ctx.body = state
    })

    for (const [actionName, action] of Object.entries(piActions)) {
        router.post(`/${actionName}`, async (ctx) => {
            logger.debug(`[PI action] ${actionName}`)
            const state = await getRiddleState<DB_STATE>(riddleId)
            const param = ctx.request.body

            const newState = await action(state, param)

            await Promise.all(
                newState.map((it) => saveRiddleState(riddleId, it))
            )

            ctx.body = newState
        })
    }

    /** start **/
    router.post(`/start`, async (ctx) => {
        logger.debug(`[Start]`)
        const checkExisting = await getRiddleState<DB_STATE>(riddleId)

        const isSolved = solved(checkExisting)
        if (isSolved) {
            await Promise.all(
                checkExisting.map((it) => finishRiddleOnDb(riddleId, it._id))
            )
        }

        const existing = await getRiddleState<DB_STATE>(riddleId)

        if (existing.some((it) => it.user === ctx.user)) {
            const active = existing.find((s) => s.user == ctx.user)
            const others = existing.filter((s) => s.user != ctx.user)
            ctx.body = getApiState({ active, others, all: existing })
            return
        }

        const state = await start(existing)

        if (!state) {
            ctx.status = 409
            ctx.body = { error: true, message: "Riddle is already started" }
            return
        }

        // inject user
        const wrapped = {
            user: ctx.user,
            isActive: true,
            lastUpdated: now(),
            lastSeen: now(),
            state,
        }
        await startRiddleOnDb(riddleId, wrapped)
        ctx.body = getApiState({
            active: wrapped,
            others: existing,
            all: [wrapped, ...existing],
        })
    })

    // Call tick every tickRateInMs
    if (tick) {
        setInterval(async () => {
            const state = await getRiddleState<DB_STATE>(riddleId)
            const newState = await tick(state)
            const promises = newState.map(
                async (player) =>
                    await saveRiddleState(riddleId, player, {
                        noUpdateLastSeen: true,
                    })
            )
            await Promise.all(promises)
        }, tickRateInMs ?? 1000)
    }

    return router.routes()
}
