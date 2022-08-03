import * as fs from "fs"
import Router from "@koa/router"
import Koa, { Next } from "koa"
import bodyParser from "koa-bodyparser"
import { initDb } from "./db"
import { log } from "./log"

const PORT = 5000
async function getAllRiddleFiles(): Promise<Array<string>> {
    return fs.readdirSync("./src/riddles")
}

async function loadModule<T>(file: string): Promise<T> {
    return await import(file)
}

const logger = log("SYSTEM")

async function mountAllRiddles(app: Koa) {
    const riddleFiles = await getAllRiddleFiles()

    for (const file of riddleFiles) {
        logger.info("[SYSTEM] loading riddle: " + file)
        const module = await loadModule<{ default: Router }>(
            `${process.cwd()}/src/riddles/${file}`
        )
        if (typeof module.default !== "function") {
            logger.error(
                "[SYSTEM] riddle module must export a default function"
            )
            throw new Error("Riddle module must export a default function")
        }
        app.use(module.default)
    }
}

async function checkAuth(ctx: Koa.Context, next: Next) {
    const user = ctx.request.headers.authorization
    if (user == undefined || !user.startsWith("User ")) {
        ctx.status = 401
        ctx.body = "Unauthorized"
        return
    }
    ctx.user = user.replace(/^User /, "")
    await next()
}

async function main() {
    logger.info("[SYSTEM] starting server")
    logger.info("[SYSTEM] initializing database")
    await initDb()

    logger.info("[SYSTEM] creating app")
    const app = new Koa()
    app.use(checkAuth)
    app.use(bodyParser())
    await mountAllRiddles(app)

    logger.info(`[SYSTEM] listening on port ${PORT}`)
    app.listen(PORT)
}

// eslint-disable-next-line no-console
main().catch(console.error)
