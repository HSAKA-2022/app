import { readdirSync } from "fs"
import { logger } from "./Framework/logger"
import { runPollingService } from "./Framework/statePollerService.js"
import { config } from "./config"

/**
 * Run Pi-App
 */
async function main() {
    logger.info("Starting Pi-App")
    runPollingService()
    runUserScripts()
    logger.info("Finished Setup")
}

/**
 * Runs all the Scripts inside the UserScripts Folder
 */
function runUserScripts() {
    //Read Files and filter for JS files
    const files = readdirSync(config.userScriptPath)
    const jsFiles = files.filter((f) => f.endsWith(".js"))
    //Execute Files
    logger.debug(`Files loaded are: ${jsFiles}`)
    for (const file of jsFiles) {
        const filePath = config.userScriptPath + file
        logger.info("Executing File: " + filePath)
        import(filePath)
            .then((module) => {
                module.default()
            })
            .catch((err) => {
                if (err) logger.error("Error executing File: " + err)
            })
    }
}
// eslint-disable-next-line no-console
main().catch(console.error)
