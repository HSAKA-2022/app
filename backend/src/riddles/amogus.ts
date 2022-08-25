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
    "94FB7826-A85E-43AB-9DC9-16BE3C2742C0": {
        name: "Wiese",
    },
    "CAEFFE70-EAA2-45FC-BBA3-63AE3D320612": {
        name: "Burg innenhof",
    },
    "23CCABE9-6327-4088-A810-F347DFEAE426": {
        name: "Werkstatt",
    },
    "597FD4EA-9416-4617-98F1-5E0CA5F5592E": {
        name: "Webraum",
    },
    "EF8F8C6C-3A8A-4961-8B48-57C7A4F5FD23": {
        name: "9 Säulen raum",
    },
    "882607A7-C13D-4EB2-9D08-63FB49F4DC29": {
        name: "Herrenhaus (+ Zimmer)",
    },
    "045B1FB2-1B06-4BF9-B696-B946DE8F9F6D": {
        name: "Torschenke, Gewölbe",
    },
    "0D630406-16B8-4CB1-9551-67419E02FAF7": {
        name: "Speisesaal",
    },
    "F1405B96-FB47-4CE6-84B2-A2CE03B1BCB9": {
        name: "Aquarium",
    },
    "606E8F89-4C41-4AEC-9A54-824614987E16": {
        name: "Halle",
    },
    "D8715BB3-A01C-43ED-B7C8-AAA4CB8FCFD1": {
        name: "vor der Halle (+ Zimmer)",
    },
    "C8717807-9581-45D3-8830-E7DE4E46A591": {
        name: "Marstall",
    },
    "715A8826-16C4-4DE7-B3B9-8436DE6B3C89": {
        name: "Hermann Schafft Raum",
    },
    "0E38C254-6F56-4C86-A8BC-FC368081A299": {
        name: "Johanna Spangenberg Raum",
    },
    "19BD7A09-397D-4C66-B244-B41A7A595B36": {
        name: "Tanzplatz",
    },
    "FA8EA579-CFB3-4EBD-9D02-F811AFF109F2": {
        name: "Woanders",
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

    ticksSinceLastScanCounterDecrement?: number
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

    scanDetection?: number

    name: string
    secret: string

    role?: Role
    isAlive: boolean

    kill?: Kill

    imposter?: {
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

export type NotRegisteredPhoneState = {
    isAlive: false
    isRegistered: false
    alreadyStarted: boolean
}

export type PlayerPhoneState = {
    userId: string
    name: string
    secret: string
    startingAt: string
    isRegistered: true
    role?: Role
    isAlive: boolean
    gameState: GameState

    imposter?: {
        otherImposters: Array<string>
        killCooldown: string
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

    rooms?: Array<string>
}

export type Report = {
    bodyId?: string
    reporterId?: string
    body?: string
    reporter?: string
}

export type AdminPhoneState = {
    name: "admin"
    startingAt: string
    isRegistered: true
    isAdmin: true
    imposter: number
    crewAlive: number
    imposterAlive: number
    gameState: GameState
    alive: Array<{ name: string; id: string }>
    diedToday: Array<{ name: string; id: string }>
    reports: Array<Report>
    killCooldownInSeconds: number
    initialKillCooldownInSeconds: number
    possibleMurdersPerImposter: number
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
    PlayerPhoneState | AdminPhoneState | NotRegisteredPhoneState
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
            secret: `${uuid()}`,
            isAdmin: false,
            calledEmergencyMeeting: false,
            foundBodies: [],
        }
    },
    solved: () => false,
    getter: (dbState) => {
        if (dbState.active == undefined) {
            const admin = dbState.all.find((it) => it.state.isAdmin) as
                | StateWrapper<AdminState>
                | undefined
            return {
                isRegistered: false,
                alreadyStarted: admin?.state?.started ?? false,
                isAlive: false,
            }
        }
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
        const cutOff = new Date()
        cutOff.setHours(cutOff.getHours() - 7)

        cutOff.setHours(7)
        cutOff.setMinutes(0)
        cutOff.setSeconds(0)
        cutOff.setMilliseconds(0)

        if (state.isAdmin) {
            return {
                name: "admin",
                isAdmin: true,
                isRegistered: true,
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
                                body: state.all.find((it) => it.user == bodyId)
                                    ?.state.name,
                                reporter: it.state.name,
                            })) ?? []
                    ),
                    ...state.alive
                        .filter((it) => it.state.calledEmergencyMeeting)
                        .map((it) => ({
                            reporterId: it.user,
                            reporter: it.state.name,
                        })),
                ],

                killCooldownInSeconds: state.admin.state.killCooldownInSeconds,
                initialKillCooldownInSeconds:
                    state.admin.state.initialKillCooldownInSeconds,
                possibleMurdersPerImposter:
                    state.admin.state.possibleMurdersPerImposter,
                diedToday: state.all
                    .filter((it) => !it.state.isAlive)
                    .filter((it) => new Date(it.state.kill?.time) > cutOff)
                    .map((it) => ({
                        name: it.state.name,
                        id: it.user,
                    })),
            }
        }

        if (state.isAdmin === false) {
            if (state.active.state.scanDetection >= 4) {
                return {
                    userId: state.active.user,
                    name: state.active.state.name,
                    secret: state.active.state.secret,
                    isRegistered: true,
                    isAdmin: false,
                    startingAt: state.admin.state.startingAt,
                    role: state.active.state.role,
                    isAlive: state.active.state.isAlive,
                    gameState,
                    imposter: (() => {
                        if (state.active.state.role !== Role.imposter)
                            return undefined

                        return {
                            killCooldown: (() => {
                                const lastedKilledAt =
                                    state.active.state.imposter?.lastedKilledAt
                                if (lastedKilledAt == undefined) {
                                    return undefined
                                }
                                const lastedKilledAtDate = new Date(
                                    lastedKilledAt
                                )
                                lastedKilledAtDate.setSeconds(
                                    lastedKilledAtDate.getSeconds() +
                                        state.admin.state.killCooldownInSeconds
                                )
                                return lastedKilledAtDate.toISOString()
                            })(),
                            otherImposters: state.others
                                .filter((it) => it.state.role == Role.imposter)
                                .map((it) => it.state.name),
                        }
                    })(),
                    calledEmergencyMeeting:
                        state.active.state.calledEmergencyMeeting,
                    rooms: Object.values(rooms)
                        .filter((it) => it.name !== "Meeting")
                        .map((it) => it.name),
                    roomInformation: {
                        room: {
                            name: "You fell into my trap!",
                        },
                        bodies: [
                            {
                                name: state.active.state.name + " 💀",
                                id: "nope",
                            },
                            {
                                name: "Wenn du nicht weisst warum hier quatsch steht, komm bei Hannes vorbei",
                                id: "nope",
                            },
                        ],
                    },
                }
            }
            return {
                userId: state.active.user,
                name: state.active.state.name,
                secret: state.active.state.secret,
                isRegistered: true,
                isAdmin: false,
                startingAt: state.admin.state.startingAt,
                role: state.active.state.role,
                isAlive: state.active.state.isAlive,
                gameState,
                imposter: (() => {
                    if (state.active.state.role !== Role.imposter)
                        return undefined

                    return {
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
                        otherImposters: state.others
                            .filter((it) => it.state.role == Role.imposter)
                            .map((it) => it.state.name),
                    }
                })(),
                calledEmergencyMeeting:
                    state.active.state.calledEmergencyMeeting,
                rooms: Object.values(rooms)
                    .filter((it) => it.name !== "Meeting")
                    .map((it) => it.name),
                roomInformation: (() => {
                    if (state.active.state.inRoom == undefined) return undefined

                    return {
                        room: Object.values(rooms).find(
                            (it) => it.name == state.active.state.inRoom
                        ),
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
                                reported: it.state.kill.reported,
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
        register: async (
            dbState,
            { name, secret }: { name: string; secret: string }
        ) => {
            const state = getState(dbState)
            if (state.isAdmin == true) return
            if (state.admin.state.started) return

            logger.info(
                `player registered; chnged name from ${state.active.state.name} to ${name}`
            )
            if (!state.active.state.name.startsWith("Crew ")) return

            state.active.state.name = name
            state.active.state.secret = secret
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

            if (rooms[roomId] == undefined) return

            const fiveMinutesAgo = new Date()

            fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 2)
            if (
                activeState.state.enteredRoomAt != undefined &&
                fiveMinutesAgo < new Date(activeState.state.enteredRoomAt)
            ) {
                activeState.state.scanDetection =
                    (activeState.state.scanDetection ?? 0) + 1
            }

            logger.info(
                `player ${state.active.state.name} went into room ${rooms[roomId].name}`
            )

            activeState.state.inRoom = rooms[roomId].name
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
                `player ${state.active.state.name} reported body of ${body?.state?.name} in room ${body?.state.kill?.room}`
            )
            if (body == undefined) return

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

        kill: async (
            dbState,
            data: { victimSecret: string; inRoom: string }
        ) => {
            const state = getState(dbState)
            if (state.isAdmin === true) return
            if (!state.admin.state.started) return

            const imposter = state.active as StateWrapper<PlayerState>

            const now = new Date().toISOString()
            const player = state.all.find(
                (it) =>
                    it.state.isAdmin == false &&
                    it.state.secret === data.victimSecret
            ) as StateWrapper<PlayerState> | undefined

            if (player == undefined) {
                return
            }

            // check cooldown
            if (imposter.state.imposter?.lastedKilledAt != undefined) {
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

            imposter.state.imposter = { lastedKilledAt: now }

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

        // not started
        if (admin == undefined) {
            return
        }

        const players = state.filter((it) => !it.state.isAdmin) as Array<
            StateWrapper<PlayerState>
        >

        admin.state.ticksSinceLastScanCounterDecrement =
            (admin.state.ticksSinceLastScanCounterDecrement ?? 0) + 1
        if (admin.state.ticksSinceLastScanCounterDecrement >= 60 * 15) {
            players.forEach((player) => {
                if (
                    player.state.scanDetection != undefined &&
                    player.state.scanDetection > 0
                ) {
                    player.state.scanDetection--
                }
            })
        }

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

// min and max included
function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function shuffle<T>(array: Array<T>): Array<T> {
    const ret = [...array]
    for (let i = ret.length - 1; i >= 1; i--) {
        const j = randomIntFromInterval(0, i)

        ;[ret[i], ret[j]] = [ret[j], ret[i]]
    }

    return ret
}
