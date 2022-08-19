import { registerCallback } from "../src/statePollerService"
import { triggerAction } from "../src/actionDispatch"
import { logger } from "../src/log"
import { setInterval } from "timers"

/**
 * Entrypoint into the Script
 */
export default async function () {
    logger.info("Starting User Script 2")
    await callActionOnRiddle3()
    registerCallbackRiddle3()
    logger.info("Finished User Script 2")
}

/**
 * Dummy Async Function, showing how to run a script every 1000 milliseconds
 */
async function callActionOnRiddle3() {
    setInterval(function () {
        const payload = {
            names: ["Alpha", "Romeo"],
            id: [1, 2],
        }
        triggerAction("riddle3", "action1", payload)
    }, 1000)
    logger.info("Calling Action on Riddle 1")
}

/**
 * Dummy Callback function
 * @param {Object} newState JSON object representing the new State
 */
function stateChangeHandlerRiddle3(newState) {
    logger.verbose("Handling State change for Riddle 3")
    logger.debug("Received new State 3: " + JSON.stringify(newState))
}

function registerCallbackRiddle3() {
    logger.info("Registring Callback for riddle3")
    registerCallback("riddle3", stateChangeHandlerRiddle3)
}
