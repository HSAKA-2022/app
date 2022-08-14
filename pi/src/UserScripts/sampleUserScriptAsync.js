import { registerCallback } from "../Framework/statePollerService.js"
import { triggerAction } from "../Framework/actionDispatch.js"
import { logger } from "../Framework/logger.js"
import { setInterval } from "timers"

/**
 * Entrypoint into the Script
 */
export default function () {
    logger.info("Starting User Script Async")
    callActionOnRiddle1()
    registerCallbackRiddle1
}

/**
 * Dummy Async Function, showing how to run a script every 1000 milliseconds
 */
async function callActionOnRiddle1() {
    setInterval(function () {
        const payload = {
            names: ["Alpha", "Romeo"],
            id: [1, 2],
        }
        triggerAction("riddle1", "action1", payload)
    }, 1000)
}

/**
 * Dummy Callback function
 * @param {Object} newState JSON object representing the new State
 */
function stateChangeHandlerRiddle1(newState) {
    logger.verbose("Handling State change for Riddle 1")
    logger.debug("Received new State1: " + JSON.stringify(newState))
}

function registerCallbackRiddle1() {
    logger.info("Registring Callback for riddle1")
    registerCallback("riddle1", stateChangeHandlerRiddle1)
}
