import * as fs from "fs"
import Router from "@koa/router"
import Koa, { Middleware, Next } from "koa"
import bodyParser from "koa-bodyparser"
import cors from "@koa/cors"
import { log } from "./log"

const excludedSuffixes = [".test.js", ".test.ts"]
async function getAllRiddleFiles(): Promise<Array<string>> {
    return fs
        .readdirSync("./src/riddles")
        .filter((it) =>
            excludedSuffixes.every((suffix) => !it.endsWith(suffix))
        )
}

async function loadModule<T>(file: string): Promise<T> {
    return await import(file)
}

const logger = log("SYSTEM")

export async function mountAllRiddles(app: Koa) {
    const riddleFiles = await getAllRiddleFiles()

    for (const file of riddleFiles) {
        logger.info("[SYSTEM] loading riddle: " + file)
        const module = await loadModule<{ default: Router }>(
            `${__dirname}/riddles/${file}`
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

export const checkAuth: Middleware = async (ctx: Koa.Context, next: Next) => {
    const user = ctx.request.headers.authorization
    if (user == undefined || !user.startsWith("User ")) {
        ctx.status = 401
        ctx.body = "Unauthorized"
        return
    }
    ctx.user = user.replace(/^User /, "")
    await next()
}

export async function buildApp(): Promise<Koa> {
    const app = new Koa()
    app.use(cors({ origin: "*" }))
    app.use(checkAuth)
    app.use(bodyParser())
    await mountAllRiddles(app)
    return app
}
