import test from "ava"
import Koa from "koa"
import supertest from "supertest"
import { v4 as uuid } from "uuid"
import { buildApp } from "../app"
import { db, initDb } from "../db"
import {
    AdminPhoneState,
    AdminState,
    GameState,
    PlayerPhoneState,
    Role,
} from "./amogus"

type Player<T> = {
    state: T
    id: string
}

type Game = {
    app: Koa
    admin: Player<AdminPhoneState>
    imposters: Array<Player<PlayerPhoneState>>
    crews: Array<Player<PlayerPhoneState>>
}

const riddleId = "amogus"

async function getPlayerState(
    app: Koa,
    playerId: string
): Promise<PlayerPhoneState> {
    return (
        await supertest(app.callback())
            .get(`/${riddleId}`)
            .set("Authorization", `User ${playerId}`)
            .expect(200)
    ).body as PlayerPhoneState
}

async function getAdmin(game: Game) {
    return await getAdminState(game.app, game.admin.id)
}

async function getAdminState(
    app: Koa,
    adminId: string
): Promise<AdminPhoneState> {
    return (
        await supertest(app.callback())
            .get(`/${riddleId}`)
            .set("Authorization", `User ${adminId}`)
            .expect(200)
    ).body as AdminPhoneState
}

async function wait(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function setupGame(
    settings: Partial<AdminState> = { imposter: 3 },
    amountOfPlayers = 10
): Promise<Game> {
    console.log("init db")
    await initDb()
    console.log("clear db")
    await db.collection(riddleId).deleteMany({})

    console.log("build app")
    const app = await buildApp()
    const adminId = uuid()
    await supertest(app.callback())
        .post(`/${riddleId}/start`)
        .set("Authorization", `User ${adminId}`)
        .send()
        .expect(200)

    const players: Array<string> = []
    for (let i = 0; i < amountOfPlayers; i++) {
        const id = uuid()
        players.push(id)
        await supertest(app.callback())
            .post(`/${riddleId}/start`)
            .set("Authorization", `User ${id}`)
            .send()
            .expect(200)
    }

    await supertest(app.callback())
        .post(`/${riddleId}/changeSettings`)
        .set("Authorization", `User ${adminId}`)
        .send({ imposter: 3, ...settings })

    await supertest(app.callback())
        .post(`/${riddleId}/changeStartAt`)
        .set("Authorization", `User ${adminId}`)
        .send({ startsAt: new Date().toISOString() })

    await wait(100)
    let started = false
    while (!started) {
        const admin = await getAdminState(app, adminId)
        started = admin.gameState === GameState.running
    }

    const playerStates = await Promise.all(
        players.map(async (it) => ({
            id: it,
            state: (
                await supertest(app.callback())
                    .get(`/${riddleId}`)
                    .set("Authorization", `User ${it}`)
                    .expect(200)
            ).body as PlayerPhoneState,
        }))
    )

    await wait(1 * 1000)

    const sorted = playerStates.reduce(
        (acc, cur) => {
            return {
                ...acc,
                [cur.state.role]: [...(acc[cur.state.role] ?? []), cur],
            }
        },
        {
            [Role.imposter]: [],
            [Role.crew]: [],
        }
    )

    return {
        imposters: sorted[Role.imposter],
        crews: sorted[Role.crew],
        app,
        admin: {
            id: adminId,
            state: (
                await supertest(app.callback())
                    .get(`/${riddleId}`)
                    .set("Authorization", `User ${adminId}`)
                    .send()
                    .expect(200)
            ).body as AdminPhoneState,
        },
    }
}

test.serial("An imposter should be able to kill", async (t) => {
    const { app, imposters, crews } = await setupGame({
        initialKillCooldownInSeconds: 0,
        possibleMurdersPerImposter: 6,
    })

    const imposter = imposters[0]
    const crew = crews[0]

    await supertest(app.callback())
        .post(`/${riddleId}/prepareKill`)
        .set("Authorization", `User ${imposter.id}`)
        .expect(200)

    const imposterStateBefore = await getPlayerState(app, imposter.id)

    await supertest(app.callback())
        .post(`/${riddleId}/kill`)
        .set("Authorization", `User ${crew.id}`)
        .send({
            secret: imposterStateBefore.imposter.secret,
            inRoom: "597FD4EA-9416-4617-98F1-5E0CA5F5592E",
        })
        .expect(200)

    const crewState = await getPlayerState(app, crew.id)
    const imposterState = await getPlayerState(app, imposter.id)

    t.is(crewState.isAlive, false)

    t.is(imposterState.isAlive, true)
    t.true(new Date(imposterState.killCooldown) > new Date())

    const otherCrew = crews[1]

    await supertest(app.callback())
        .post(`/${riddleId}/goIntoRoom`)
        .set("Authorization", `User ${otherCrew.id}`)
        .send({ roomId: "597FD4EA-9416-4617-98F1-5E0CA5F5592E" })
        .expect(200)

    const otherCrewState = await getPlayerState(app, otherCrew.id)

    t.is(otherCrewState.isAlive, true)
    t.is(otherCrewState.roomInformation.bodies.length, 1)
    const body = otherCrewState.roomInformation.bodies[0]
    t.is(body.id, crew.id)

    await supertest(app.callback())
        .post(`/${riddleId}/reportBody`)
        .set("Authorization", `User ${otherCrew.id}`)
        .send({ bodyId: crew.id })
        .expect(200)

    const otherCrewStateAfterReport = await getPlayerState(app, otherCrew.id)
    t.is(otherCrewStateAfterReport.roomInformation.bodies.length, 1)
    const bodyAfterReport = otherCrewStateAfterReport.roomInformation.bodies[0]
    t.is(bodyAfterReport.id, crew.id)
    t.is(bodyAfterReport.possibleMurders.length, 6)
    t.true(
        bodyAfterReport.possibleMurders.some((it) => it === imposter.state.name)
    )
})

test.serial("imposters win", async (t) => {
    const { app, imposters, crews } = await setupGame({
        initialKillCooldownInSeconds: 0,
        killCooldownInSeconds: 0,
    })

    const imposter = imposters[0]
    for (const crew of crews) {
        await supertest(app.callback())
            .post(`/${riddleId}/prepareKill`)
            .set("Authorization", `User ${imposter.id}`)
            .expect(200)

        const imposterStateBefore = await getPlayerState(app, imposter.id)

        await supertest(app.callback())
            .post(`/${riddleId}/kill`)
            .set("Authorization", `User ${crew.id}`)
            .send({
                secret: imposterStateBefore.imposter.secret,
                inRoom: "597FD4EA-9416-4617-98F1-5E0CA5F5592E",
            })
            .expect(200)
    }
    const crewState = await getPlayerState(app, crews[0].id)

    t.is(crewState.gameState, GameState.impostersWon)
})

test.serial("crew win", async (t) => {
    const { app, admin, imposters, crews } = await setupGame({
        initialKillCooldownInSeconds: 0,
        killCooldownInSeconds: 0,
    })

    for (const imposter of imposters) {
        await supertest(app.callback())
            .post(`/${riddleId}/voteKillPlayer`)
            .send({ playerId: imposter.id })
            .set("Authorization", `User ${admin.id}`)
            .expect(200)

        const imposterState = await getPlayerState(app, imposter.id)
        t.is(imposterState.isAlive, false)
    }
    const crewState = await getPlayerState(app, crews[0].id)

    t.is(crewState.gameState, GameState.crewWon)
})

test.serial.only("simulate game", async () => {
    const results: Array<{ state: GameState; days: number }> = []
    for (let i = 0; i < 10; i++) {
        await wait(100)
        try {
            results.push(await simulateGame())
        } catch (e) {
            // ignore
        }
    }

    const stateAggregate = results.reduce(
        (acc, cur) => ({ ...acc, [cur.state]: (acc[cur.state] ?? 0) + 1 }),
        {}
    )
    console.dir(stateAggregate)

    const daysAggregate = results.reduce(
        (acc, cur) => ({ ...acc, [cur.days]: (acc[cur.days] ?? 0) + 1 }),
        {}
    )
    console.dir(daysAggregate)
})

async function simulateGame(): Promise<{ state: GameState; days: number }> {
    const game = await setupGame(
        {
            initialKillCooldownInSeconds: 0,
            killCooldownInSeconds: 0,
            possibleMurdersPerImposter: 4,
            imposter: 6,
        },
        50
    )

    let day = 0
    let adminState = await getAdmin(game)
    while (adminState.gameState === GameState.running) {
        console.log("starting day")
        const alive = await Promise.all(
            adminState.alive.map(async (it) => ({
                id: it.id,
                state: await getPlayerState(game.app, it.id),
            }))
        )

        let aliveCrews = alive.filter((it) => it.state.role === Role.crew)

        const imposterAlive = alive.filter(
            (it) => it.state.role === Role.imposter
        )

        console.log("imposter")

        // every imposter kills
        for (const imposter of imposterAlive) {
            // no more to kill
            if (aliveCrews.length === 0) break

            const victimIndex = Math.floor(Math.random() * aliveCrews.length)

            const victim = aliveCrews[victimIndex]

            await supertest(game.app.callback())
                .post(`/${riddleId}/prepareKill`)
                .set("Authorization", `User ${imposter.id}`)
                .expect(200)

            const imposterStateKill = await getPlayerState(
                game.app,
                imposter.id
            )

            await supertest(game.app.callback())
                .post(`/${riddleId}/kill`)
                .set("Authorization", `User ${victim.id}`)
                .send({
                    secret: imposterStateKill.imposter.secret,
                    inRoom: "597FD4EA-9416-4617-98F1-5E0CA5F5592E",
                })
                .expect(200)

            aliveCrews = [
                ...aliveCrews.slice(0, victimIndex),
                ...aliveCrews.slice(victimIndex + 1),
            ]
        }
        console.log("crew")

        // every crew has a chance to find a body
        for (const crew of aliveCrews) {
            if (Math.random() > 0.6) continue

            await supertest(game.app.callback())
                .post(`/${riddleId}/goIntoRoom`)
                .set("Authorization", `User ${crew.id}`)
                .send({ roomId: "597FD4EA-9416-4617-98F1-5E0CA5F5592E" })
                .expect(200)

            const playerState = await getPlayerState(game.app, crew.id)
            if (!playerState.isAlive) continue

            const body = playerState.roomInformation?.bodies?.[0]
            if (body == undefined) continue
            await supertest(game.app.callback())
                .post(`/${riddleId}/reportBody`)
                .set("Authorization", `User ${crew.id}`)
                .send({ bodyId: body.id })
                .expect(200)
            console.log("get player state")

            const playerStateAfterReport = await getPlayerState(
                game.app,
                crew.id
            )

            console.log("kill?")
            // don't kill all the time
            if (Math.random() > 0.5) continue
            const reportedBody =
                playerStateAfterReport.roomInformation?.bodies?.find(
                    (it) => it.possibleMurders != undefined
                )
            const murderNames = reportedBody.possibleMurders

            const randomKill =
                murderNames[Math.floor(Math.random() * murderNames.length)]
            const randomKillPlayer = game.admin.state.alive.find(
                (it) => it.name === randomKill
            )

            console.log("kill random murder")
            await supertest(game.app.callback())
                .post(`/${riddleId}/voteKillPlayer`)
                .send({ playerId: randomKillPlayer.id })
                .set("Authorization", `User ${game.admin.id}`)
                .expect(200)
        }
        console.log("close meeting")

        await supertest(game.app.callback())
            .post(`/${riddleId}/closeMeeting`)
            .send()
            .set("Authorization", `User ${game.admin.id}`)
            .expect(200)

        adminState = await getAdmin(game)
        console.log(
            `Day ${day++} - ${adminState.gameState}; ${
                adminState.imposterAlive
            } vs ${adminState.crewAlive}`
        )
    }
    return { state: adminState.gameState, days: day }
}
