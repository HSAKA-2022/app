import { readdirSync } from 'fs';
import { logger } from './Framework/logger.js';
import { runPollingService } from './Framework/statePollerService.js';
import { config } from './config.js'

//Main Entrypoint
main();

/**
 * Run Pi-App
 */
function main() {
  logger.info("Starting Pi-App")
  runPollingService();
  runUserScripts();
  logger.info("Finished Setup")
}

/**
 * Runs all the Scripts inside the UserScripts Folder
 */
function runUserScripts() {
  //Read Files and filter for JS files
  const files = readdirSync( config.userScriptPath )
  const jsFiles = files.filter(f => f.endsWith('.js'))
  //Execute Files
  logger.debug(`Files loaded are: ${jsFiles}`)
  for (const file of jsFiles) {
    const filePath = config.userScriptPath  + file
    logger.info("Executing File: " + filePath)
    import(filePath)
      .then((module) => {
        module.default()
      })
      .catch((err) => { if (err) console.error(err) })
  }
}