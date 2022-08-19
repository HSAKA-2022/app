import { buildApp } from "./app"
import { initDb } from "./db"
import { log } from "./log"

const PORT = 5000

const logger = log("SYSTEM")

async function main() {
    logger.info("[SYSTEM] starting server")
    logger.info("[SYSTEM] initializing database")
    await initDb()

    logger.info("[SYSTEM] creating app")
    const app = await buildApp()

    logger.info(`[SYSTEM] listening on port ${PORT}`)
    app.listen(PORT)
}

// eslint-disable-next-line no-console
main().catch(console.error)
