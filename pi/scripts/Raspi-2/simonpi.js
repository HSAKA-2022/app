import { registerCallback } from "../../src/statePollerService"
import { triggerAction } from "../../src/actionDispatch"
import { logger } from "../../src/log"
import { v3 } from "node-hue-api"

const api = await v3.api
    .createLocal("192.168.5.116")
    .connect("AT0cUBe8aB9zedDIkfkVi3l9jOkRwIrVhfzqTZlm")
/**
 * Entrypoint into the Script
 */
export default async function () {
    logger.info("Starting User Script 1")
    await callActionOnRiddle1()
    registerCallback("riddle1", changeColors)
    logger.info("Finished User Script 1")
}

/**
 * Dummy Action Trigger function, calling the backend with a dummy payload
 */
async function callActionOnRiddle1() {
    const payload = {}
    payload.names = ["Emil", "Berta"]
    payload.id = [1, 2]
    await triggerAction("riddle1", "action1", payload)
}

/**
 * Dummy Callback function
 * @param {Object} newState JSON object representing the new State
 */
async function changeColors(newState) {
    const green = new LightState().rgb(103, 190, 97).alertShort()

    for (let i = 0; i < newState.all[0].state.sequence.length; i++) {}
    const lampOne = 12
    const lampTwo = 5
    const lampThree = 8
    const lampFour = 9
    for (let i = 0; i < 20; i++) {
        try {
            console.log("Setting light " + i)
            await api.lights.setLightState(lampOne, new LightState().off())
            await sleep(100)
            await api.lights.setLightState(lampOne, green)
        } catch (e) {}
        await sleep(1000)
    }
}
/**
 * Dummy Callback function
 * @param {Object} newState JSON object representing the new State
 */
function stateChangeHandlerRiddle2(newState) {
    logger.verbose("Handling State change for Riddle 2")
    logger.debug("Received new State2: " + JSON.stringify(newState))
}

function registerCallbackRiddle2() {
    logger.info("Registring Callback for riddle2")
    registerCallback("riddle2", stateChangeHandlerRiddle2)
}
