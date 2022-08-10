import { v4 as uuid } from "uuid"
import { log } from "../log"
import { riddle, RiddleState, StateWrapper } from "../riddle"

const riddleId = "amogus"

type Room = {
    name: string
}

const logger = log(riddleId)
export const rooms: Record<string, Room> = {
    Meeting: {
        name: "Meeting",
    },
    "597FD4EA-9416-4617-98F1-5E0CA5F5592E": {
        name: "Webraum",
    },
}

export enum Role {
    imposter = "imposter",
    crew = "crew",
}

export type AdminState = {
    name: "admin"
    isAdmin: true
    imposter: number
    startingAt: string
    started: boolean
    killCooldownInSeconds: number
    initialKillCooldownInSeconds: number
    possibleMurdersPerImposter: number
}

type Kill = {
    time: string
    room: string
    murderer: "vote" | string // "vote" if voted, <player id> otherwise
    reported: boolean
    reportedBy?: string
    possibleMurders?: Array<string>
}

export type PlayerState = {
    isAdmin: false

    name: string
    role?: Role
    isAlive: boolean

    kill?: Kill

    imposter?: {
        secret: string
        validUntil: string
        lastedKilledAt?: string
    }

    // reported bodies
    foundBodies: Array<string>
    calledEmergencyMeeting: boolean

    inRoom?: string
    enteredRoomAt?: string
}

export enum GameState {
    lobby = "lobby",
    running = "running",
    crewWon = "crewWon",
    impostersWon = "impostersWon",
}

export type PlayerPhoneState = {
    name: string
    startingAt: string
    role?: Role
    isAlive: boolean
    gameState: GameState

    killCooldown?: string

    imposter?: {
        secret: string
    }

    roomInformation?: {
        room: Room
        bodies: Array<{
            name: string
            id: string
            possibleMurders?: Array<string>
            reported?: boolean
        }>
    }
}

export type Report = {
    bodyId?: string
    reporterId?: string
}

export type AdminPhoneState = {
    name: "admin"
    startingAt: string
    imposter: number
    crewAlive: number
    imposterAlive: number
    gameState: GameState
    alive: Array<{ name: string; id: string }>
    reports: Array<Report>
}

type OurState =
    | {
          isAdmin: true
          admin: StateWrapper<AdminState>
          all: Array<StateWrapper<PlayerState>>
          alive: Array<StateWrapper<PlayerState>>
      }
    | {
          isAdmin: false
          active: StateWrapper<PlayerState>
          admin: StateWrapper<AdminState>
          all: Array<StateWrapper<PlayerState>>
          alive: Array<StateWrapper<PlayerState>>
          others: Array<StateWrapper<PlayerState>>
      }

function getState(state: RiddleState<PlayerState | AdminState>): OurState {
    const admin = state.all.find(
        (it) => it.state.isAdmin
    ) as StateWrapper<AdminState>
    const all = state.all.filter((it) => it.user != admin.user) as Array<
        StateWrapper<PlayerState>
    >
    const alive = all.filter((it) => it.state.isAlive)
    if (state.active.state.isAdmin) {
        return {
            isAdmin: true,
            admin: state.active as StateWrapper<AdminState>,
            all,
            alive,
        }
    }

    return {
        isAdmin: false,
        admin,
        active: state.active as StateWrapper<PlayerState>,
        all,
        alive,
        others: state.others.filter((it) => it.user != admin.user) as Array<
            StateWrapper<PlayerState>
        >,
    }
}

export default riddle<
    PlayerState | AdminState,
    PlayerPhoneState | AdminPhoneState
>({
    riddleId,
    start: async (existing) => {
        if (existing.length == 0) {
            logger.info("Starting game")

            const start = new Date()
            start.setHours(start.getHours() + 24)
            return {
                name: "admin",
                startingAt: start.toISOString(),
                started: false,
                imposter: 10,
                isAdmin: true,
                killCooldownInSeconds: 13 * 60 * 60,
                initialKillCooldownInSeconds: 2 * 60 * 60,
                possibleMurdersPerImposter: 10,
            }
        }

        // can't join late
        const admin = existing.find(
            (it) => it.state.isAdmin
        ) as StateWrapper<AdminState>
        const startingAt = new Date(admin.state.startingAt)

        if (startingAt < new Date()) {
            logger.info("Late joining attempt")
            return
        }

        logger.info("New player joined")
        return {
            name: `Crew ${Math.floor(Math.random() * 1000)}`,
            isAlive: true,
            isAdmin: false,
            calledEmergencyMeeting: false,
            foundBodies: [],
        }
    },
    solved: () => false,
    getter: (dbState) => {
        const state = getState(dbState)
        const gameState = (() => {
            if (!state.admin.state.started) {
                return GameState.lobby
            }
            const aliveRoles = state.alive
                .map((it) => it.state.role)
                // this is mostly redundant
                .filter((it) => it != undefined)
                .reduce(
                    (acc, cur) => ({ ...acc, [cur]: true }),
                    {} as Partial<Record<Role, true>>
                )
            if (aliveRoles.crew && aliveRoles.imposter) return GameState.running
            if (aliveRoles.crew && !aliveRoles.imposter)
                return GameState.crewWon
            if (!aliveRoles.crew && aliveRoles.imposter)
                return GameState.impostersWon

            throw new Error(
                `This gameState does not exist! ${JSON.stringify(
                    { alive: state.alive },
                    null,
                    2
                )}`
            )
        })()

        if (state.isAdmin) {
            return {
                name: "admin",
                startingAt: state.admin.state.startingAt,
                imposter: state.admin.state.imposter,
                crewAlive: state.alive.filter(
                    (it) => it.state.role == Role.crew
                ).length,
                imposterAlive: state.alive.filter(
                    (it) => it.state.role == Role.imposter
                ).length,
                alive: state.alive.map((it) => ({
                    name: it.state.name,
                    id: it.user,
                })),
                gameState,
                reports: [
                    ...state.alive.flatMap(
                        (it) =>
                            it.state.foundBodies?.map((bodyId) => ({
                                bodyId: bodyId,
                                reporterId: it.user,
                            })) ?? []
                    ),
                    ...state.alive
                        .filter((it) => it.state.calledEmergencyMeeting)
                        .map((it) => ({ reporterId: it.user })),
                ],
            }
        }

        if (state.isAdmin === false) {
            return {
                name: state.active.state.name,
                startingAt: state.admin.state.startingAt,
                role: state.active.state.role,
                isAlive: state.active.state.isAlive,
                gameState,
                // todo see other imposters
                imposter: (() => {
                    if (state.active.state.role !== Role.imposter)
                        return undefined

                    return {
                        secret: state.active.state.imposter.secret,
                    }
                })(),
                killCooldown: (() => {
                    const lastedKilledAt =
                        state.active.state.imposter?.lastedKilledAt
                    if (lastedKilledAt == undefined) {
                        return undefined
                    }
                    const lastedKilledAtDate = new Date(lastedKilledAt)
                    lastedKilledAtDate.setSeconds(
                        lastedKilledAtDate.getSeconds() +
                            state.admin.state.killCooldownInSeconds
                    )
                    return lastedKilledAtDate.toISOString()
                })(),
                roomInformation: (() => {
                    if (state.active.state.inRoom === undefined)
                        return undefined

                    const cutOff = new Date()
                    cutOff.setHours(4)
                    cutOff.setDate(cutOff.getDate() - 1)
                    return {
                        room: rooms[state.active.state.inRoom],
                        bodies: state.all
                            .filter((it) => !it.state.isAlive)
                            .filter(
                                (it) =>
                                    it.state.kill.room ===
                                    state.active.state.inRoom
                            )
                            .filter(
                                (it) =>
                                    it.state.kill.reported === false ||
                                    it.state.kill.reportedBy ===
                                        state.active.user
                            )
                            .filter(
                                (it) => new Date(it.state.kill.time) > cutOff
                            )
                            .map((it) => ({
                                name: it.state.name,
                                id: it.user,
                                possibleMurders: (() => {
                                    if (
                                        it.state.kill.reportedBy ===
                                        state.active.user
                                    ) {
                                        return it.state.kill.possibleMurders.map(
                                            (murderer) =>
                                                state.all.find(
                                                    (it) => it.user === murderer
                                                ).state.name
                                        )
                                    }
                                    return undefined
                                })(),
                            })),
                    }
                })(),
            }
        }
    },
    phoneActions: {
        /**
         * Setup
         */
        changeName: async (dbState, name: string) => {
            const state = getState(dbState)
            if (state.isAdmin == true) return
            if (state.admin.state.started) return

            logger.info(
                `player change name from ${state.active.state.name} to ${name}`
            )
            if (!state.active.state.name.startsWith("Crew ")) return

            state.active.state.name = name
            return dbState
        },

        changeStartAt: async (state, { startsAt }: { startsAt: string }) => {
            if (state.active.state.isAdmin == false) return
            if (state.active.state.started) return
            logger.info(`changing starting time to ${startsAt}`)

            state.active.state.startingAt = startsAt

            return state
        },
        changeSettings: async (state, settings: Partial<AdminState>) => {
            if (state.active.state.isAdmin == false) return

            logger.info(`changing settings to ${JSON.stringify(settings)}`)
            state.active.state = { ...state.active.state, ...settings }
            return state
        },

        changeNumberOfImposters: async (
            state,
            { imposters }: { imposters: number }
        ) => {
            if (state.active.state.isAdmin == false) return
            if (state.active.state.started) return
            logger.info(`changing number of imposters to ${imposters}`)

            state.active.state.imposter = imposters

            return state
        },

        /**
         * Room logic
         */
        goIntoRoom: async (dbState, { roomId }: { roomId: string }) => {
            const state = getState(dbState)
            if (state.isAdmin == true) return
            if (!state.admin.state.started) return

            const activeState = state.active as StateWrapper<PlayerState>
            if (!activeState.state.isAlive) return

            logger.info(
                `player ${state.active.state.name} went into room ${rooms[roomId].name}`
            )

            activeState.state.inRoom = roomId
            activeState.state.enteredRoomAt = new Date().toISOString()

            return dbState
        },

        reportBody: async (dbState, { bodyId }: { bodyId: string }) => {
            const state = getState(dbState)
            if (state.isAdmin == true) return
            if (!state.admin.state.started) return

            if (!state.active.state.isAlive) return

            const body = state.all.find(
                (it) => it.user === bodyId
            ) as StateWrapper<PlayerState>
            logger.info(
                `player ${state.active.state.name} reported body of ${
                    body.state.name
                } in room ${rooms[body.state.kill?.room].name}`
            )

            const killInformation = body.state.kill as Kill
            killInformation.reported = true
            killInformation.reportedBy = state.active.user

            state.active.state.foundBodies.push(bodyId)
            return dbState
        },

        /**
         *  raise hands
         */

        callEmergencyMeeting: async (dbState) => {
            const state = getState(dbState)
            if (state.isAdmin == true) return
            if (!state.admin.state.started) return

            const activeState = state.active as StateWrapper<PlayerState>

            if (!activeState.state.isAlive) return
            if (activeState.state.calledEmergencyMeeting) return
            logger.info(
                `player ${state.active.state.name} called emergency meeting`
            )

            activeState.state.calledEmergencyMeeting = true
            return dbState
        },

        /**
         * meeting
         */
        voteKillPlayer: async (state, { playerId }: { playerId: string }) => {
            if (!state.active.state.isAdmin) return
            if (!state.active.state.started) return

            const victim = state.all.find(
                (it) => it.user == playerId
            ) as StateWrapper<PlayerState>
            logger.info(`vote killed ${victim.state.name}`)

            victim.state.isAlive = false
            victim.state.kill = {
                murderer: "vote",
                time: new Date().toISOString(),
                reported: false,
                room: "Meeting",
            }

            return state
        },

        closeMeeting: async (state) => {
            if (!state.active.state.isAdmin) return
            if (!state.active.state.started) return

            logger.info(`closed meeting`)
            state.all.forEach((it) => {
                if (it.state.isAdmin) return
                const player = it as StateWrapper<PlayerState>
                player.state.calledEmergencyMeeting = false
                player.state.foundBodies = []
            })

            return state
        },

        /**
         * Imposter action
         */

        // do we really need the secret stuff here?
        prepareKill: async (dbState) => {
            const state = getState(dbState)
            if (!state.admin.state.started) return

            if (state.isAdmin === true) return
            if (state.active.state.role !== Role.imposter) return

            // check cooldown
            if (state.active.state.imposter.lastedKilledAt != undefined) {
                const cooldownEndsAt = new Date(
                    state.active.state.imposter.lastedKilledAt
                )
                cooldownEndsAt.setSeconds(
                    cooldownEndsAt.getSeconds() +
                        state.admin.state.killCooldownInSeconds
                )
                if (cooldownEndsAt > new Date()) {
                    logger.info(
                        `imposter ${
                            state.active.state.name
                        } is on cooldown until ${cooldownEndsAt.toISOString()}`
                    )
                    return
                }
            }

            const date = new Date()
            date.setMinutes(date.getMinutes() + 15)
            state.active.state.imposter = {
                secret: uuid(),
                validUntil: date.toISOString(),
            }

            return dbState
        },

        kill: async (dbState, data: { secret: string; inRoom: string }) => {
            const state = getState(dbState)
            if (state.isAdmin === true) return
            if (!state.admin.state.started) return

            const player = state.active as StateWrapper<PlayerState>

            const now = new Date().toISOString()
            const imposter = state.all.find(
                (it) =>
                    it.state.isAdmin == false &&
                    it.state.imposter != undefined &&
                    it.state.imposter?.secret === data.secret
            ) as StateWrapper<PlayerState>

            // check cooldown
            if (imposter.state.imposter.lastedKilledAt != undefined) {
                const cooldownEndsAt = new Date(
                    imposter.state.imposter.lastedKilledAt
                )
                cooldownEndsAt.setSeconds(
                    cooldownEndsAt.getSeconds() +
                        state.admin.state.killCooldownInSeconds
                )
                if (cooldownEndsAt > new Date()) {
                    logger.info(
                        `${imposter.state.name} tries to kill ${player.state.name}, but is still in cooldown`
                    )
                    return
                }
            }

            imposter.state.imposter.lastedKilledAt = now

            logger.info(`${imposter.state.name} killed ${player.state.name}`)

            const possibleMurders = [
                imposter.user,
                ...shuffle(
                    state.alive
                        .filter((it) => it.user !== imposter.user)
                        .filter((it) => it.user !== player.user)
                )
                    .slice(0, state.admin.state.possibleMurdersPerImposter - 1)
                    .map((it) => it.user),
            ]

            player.state.kill = {
                time: now,
                room: data.inRoom,
                murderer: imposter.user,
                reported: false,
                possibleMurders: shuffle(possibleMurders),
            }
            player.state.isAlive = false

            return dbState
        },
    },

    tick: async (state) => {
        const admin = state.find(
            (it) => it.state.isAdmin == true
        ) as StateWrapper<AdminState>
        const players = state.filter((it) => !it.state.isAdmin) as Array<
            StateWrapper<PlayerState>
        >

        ;(
            players.filter((it) => it.state.isAdmin == false) as Array<
                StateWrapper<PlayerState>
            >
        ).forEach((it) => {
            // Kick out of room
            if (it.state.inRoom) {
                const roomCheckout = new Date(it.state.enteredRoomAt)
                roomCheckout.setMinutes(roomCheckout.getMinutes() + 15)

                if (roomCheckout < new Date()) {
                    it.state.inRoom = undefined
                    it.state.enteredRoomAt = undefined
                }
            }
        })

        // starting game
        if (
            !admin.state.started &&
            new Date(admin.state.startingAt) < new Date()
        ) {
            logger.info("Starting game!!!!!!!!!")

            const shuffled = shuffle([...players])

            const imposters = shuffled.slice(0, admin.state.imposter)

            const crew = shuffled.slice(admin.state.imposter, shuffled.length)

            const cooldownStartImposters = new Date()
            cooldownStartImposters.setSeconds(
                cooldownStartImposters.getSeconds() -
                    admin.state.killCooldownInSeconds
            )
            cooldownStartImposters.setSeconds(
                cooldownStartImposters.getSeconds() +
                    admin.state.initialKillCooldownInSeconds
            )
            imposters.forEach((it) => {
                it.state.role = Role.imposter
                it.state.imposter = {
                    lastedKilledAt: cooldownStartImposters.toISOString(),
                    // fake secret and valid until, just to satisfy types
                    secret: "none",
                    validUntil: cooldownStartImposters.toISOString(),
                }
            })

            crew.forEach((it) => {
                it.state.role = Role.crew
            })
            admin.state.started = true
        }

        return state
    },
    tickRateInMs: 1000,
    piActions: {},
})

function shuffle<T>(array: Array<T>): Array<T> {
    let currentIndex = array.length,
        randomIndex

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        ;[array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ]
    }

    return array
}
