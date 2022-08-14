import { readdirSync } from "fs"
import { logger } from "./log"
import { runPollingService } from "./statePollerService"
import { config } from "./config"
import * as path from "path"

/**
 * Run Pi-App
 */
async function main() {
    logger.info("Starting Pi-App")
    await runPollingService()
    await runUserScripts()
    logger.info("Finished Setup")
}

/**
 * Runs all the Scripts inside the UserScripts Folder
 */
async function runUserScripts() {
    //Read Files and filter for JS files
    const files = readdirSync(config.userScriptPath)
    const jsFiles = files.filter((f) => f.endsWith(".js"))
    //Execute Files
    logger.debug(`Files loaded are: ${jsFiles}`)
    for (const file of jsFiles) {
        const filePath = path.join("../", config.userScriptPath, file)
        logger.info("Executing File: " + filePath)
        try {
            const module = await import(filePath)
            await module.default()
        } catch (error) {
            logger.error("Error executing File: " + error)
        }
    }
}
// eslint-disable-next-line no-console
main().catch(console.error)
