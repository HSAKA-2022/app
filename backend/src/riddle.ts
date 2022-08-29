import Router from "@koa/router"
import { Middleware } from "koa"
import {
    finishRiddleOnDb,
    getAllHistoricStates,
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

export type GameMode =
    // The default mode
    | "default"
    // Allows users to run the game at the same time, solving it independently. Will only clean up the user, if they are finished, indepenent of all other.
    // The solved function will only get
    | "simultaneousSinglePlayer"

export function riddle<DB_STATE, API_STATE, LEADERBOARD_STATE = unknown>({
    riddleId,
    start,
    mode: configMode,
    solved,
    getter,
    phoneActions,
    piActions,
    tick,
    tickRateInMs,
    getLeaderboard,
    leaderboardIncludesActive,
}: {
    /**
     * The name of the riddle
     */
    riddleId: string

    mode?: GameMode
    /**
     * Gets called if a player starts the game with a POST to `/:riddleId/start`
     * @param existingState an Array, of all existing WrappedStates
     * @returns the state of the new player, or undefined if the player can't start the game for some reason
     */
    start: (
        existingState: Array<StateWrapper<DB_STATE>>
    ) => Promise<DB_STATE | undefined>
    /**
     * Returns of the current game is solved
     * @param state Array of all WrappedStates
     * @returns true if the game is solved, false otherwise
     */
    solved: (state: Array<StateWrapper<DB_STATE>>) => boolean
    /**
     * Gets called every {tick*ateInMs} milliseconds and can modify the state of the game
     * @param state Array of all WrappedStates
     * @retuns the new state of the game (mostly the same as the old state + modifications)
     */
    tick?: (
        state: Array<StateWrapper<DB_STATE>>
    ) => Promise<Array<StateWrapper<DB_STATE>>>
    /**
     * How often to call {tick} in milliseconds
     */
    tickRateInMs?: number
    /**
     * Gets called when a player sends a GET to `/:riddleId`
     * Should transform the internal state of the server, to the state the user is allowed to see
     * @param state { active: StateWrapper<DB_STATE>, others: Array<StateWrapper<DB_STATE>> } The state of the active player, and the state of all other players (an Array!)
     * @returns the state the user is allowed to see
     */
    getter: (state: RiddleState<DB_STATE>) => API_STATE
    /**
     * Object of PhoneActionHandlers
     * Each PhoneActionHandler, gets called when the corresponding URL is being called.
     * The first argument of each handler, is the current state (see getter), the second is whatever the phone send us
     * Each handler returns the new state of the game
     */
    phoneActions?: Record<string, PhoneAction<unknown, DB_STATE>>
    /**
     * Object of PiActionHandlers
     * Each PiActionHandler, gets called when the corresponding URL is being called.
     * The first argument of each handler, is the current state (Array of WrappedStates), the second is whatever the pi send us
     * Each handler returns the new state of the game
     */
    piActions?: Record<string, PiAction<unknown, DB_STATE>>
    /**
     * Gets called when a player sends a GET to `/:riddleId/leaderboard`
     * Maps all historic states to a leaderboard
     */
    getLeaderboard?: (state: Array<StateWrapper<DB_STATE>>) => LEADERBOARD_STATE
    /**
     * If the leaderboards also contains current active states
     */
    leaderboardIncludesActive?: boolean
}): Middleware {
    const logger = log(riddleId)
    const router = new Router().prefix(`/${riddleId}`)

    const mode = configMode ?? "default"

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

        if (mode === "default") {
            const isSolved = solved(state)

            if (isSolved) {
                logger.info(`${ctx.user} solved the riddle`)
                setTimeout(async () => {
                    state.forEach((it) => {
                        finishRiddleOnDb(riddleId, it._id)
                    })
                }, 60 * 1000)
            }
        } else if (mode === "simultaneousSinglePlayer") {
            const sameUserExisting = state.find((it) => it.user === ctx.user)
            if (sameUserExisting != undefined) {
                if (solved([sameUserExisting])) {
                    await finishRiddleOnDb(riddleId, sameUserExisting._id)
                }
            }
        }

        await updateLastSeen(riddleId, ctx.user)

        ctx.body = getApiState({ active, others, all: state })
    })

    if (phoneActions != undefined) {
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
                const newState = await action(
                    { active, others, all: state },
                    param
                )

                if (newState != undefined) {
                    logger.debug("saving new state")
                    await saveRiddleState(riddleId, newState.active)
                    await Promise.all(
                        newState.others.map((it) =>
                            saveRiddleState(riddleId, it)
                        )
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
    }

    /** PI methods  */
    router.get(`/raw-state`, async (ctx) => {
        if (riddleId === "amogus") {
            ctx.body = {
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                text: "you found the easter egg. If you read this in code: happy coding!",
            }
            return
        }
        if (ctx.user !== "pi-854F8C71-D050-4F98-8FD5-72AD9C5E6870") {
            ctx.status = 403
            return
        }
        const state = await getRiddleState<DB_STATE>(riddleId)

        ctx.body = state
    })

    if (piActions != undefined) {
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
    }
    /** start **/
    router.post(`/start`, async (ctx) => {
        logger.debug(`[Start]`)
        const checkExisting = await getRiddleState<DB_STATE>(riddleId)

        if (mode === "default") {
            const isSolved = solved(checkExisting)
            if (isSolved) {
                await Promise.all(
                    checkExisting.map((it) =>
                        finishRiddleOnDb(riddleId, it._id)
                    )
                )
            }
        } else if (mode === "simultaneousSinglePlayer") {
            const sameUserExisting = checkExisting.find(
                (it) => it.user === ctx.user
            )
            if (sameUserExisting != undefined) {
                if (solved([sameUserExisting])) {
                    await finishRiddleOnDb(riddleId, sameUserExisting._id)
                }
            }
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
            if (state.length === 0) {
                return
            }
            const newState = await tick(state)
            if (newState != undefined) {
                const promises = newState.map(
                    async (player) =>
                        await saveRiddleState(riddleId, player, {
                            noUpdateLastSeen: true,
                        })
                )
                await Promise.all(promises)
            }
        }, tickRateInMs ?? 1000)
    }

    /** leaderboard **/
    if (getLeaderboard != undefined) {
        router.get(`/leaderboard`, async (ctx) => {
            const state = await getAllHistoricStates<DB_STATE>(
                riddleId,
                leaderboardIncludesActive
            )
            ctx.body = getLeaderboard(state)
        })
    }

    return router.routes()
}
