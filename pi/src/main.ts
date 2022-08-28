import { readdirSync } from "fs"
import { logger } from "./log"
import { runPollingService } from "./statePollerService"
import { config } from "./config"
import * as path from "path"
import dotenv from "dotenv"

/**
 * Run Pi-App
 */
async function main() {
    dotenv.config()
    logger.info("Starting Pi-App")
    console.log("User is: " + require("os").userInfo().username)
    await runPollingService()
    await runUserScripts()
    logger.info("Finished Setup")
}

/**
 * Runs all the Scripts inside the UserScripts Folder
 */
async function runUserScripts() {
    //Read Files and filter for JS files
    if ("hostname" in process.env) {
        const completePath = path.join(
            config.userScriptPath,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            process.env.hostname!
        )
        const files = readdirSync(completePath)
        const jsFiles = files.filter((f) => f.endsWith(".js"))
        //Execute Files
        logger.debug(`Files loaded are: ${jsFiles}`)
        for (const file of jsFiles) {
            const filePath = path.join("../", completePath, file)
            logger.info("Executing File: " + filePath)
            try {
                const module = await import(filePath)
                await module.default()
            } catch (error) {
                logger.error("Error executing File: " + error)
            }
        }
    } else {
        logger.error("No Hostname found in .env")
    }
}
// eslint-disable-next-line no-console
main().catch(console.error)
