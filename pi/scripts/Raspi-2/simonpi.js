import { registerCallback } from "../../src/statePollerService"
import { triggerAction } from "../../src/actionDispatch"
import { logger } from "../../src/log"
import { v3 } from "node-hue-api"
import sampleUserScript from "../sampleUserScript"

const apiPromise = v3.api
    .createLocal("192.168.5.116")
    .connect("AT0cUBe8aB9zedDIkfkVi3l9jOkRwIrVhfzqTZlm")
/**
 * Entrypoint into the Script
 */
export default async function () {
    logger.info("Starting User Script 1")
    test
    await callActionOnRiddle1()
    registerCallback("simon", changeColors)
    logger.info("Finished User Script 1")
}

/**
 * Dummy Action Trigger function, calling the backend with a dummy payload
 */
async function callActionOnRiddle1() {
    const payload = {}
    await triggerAction("simon", "action1", payload)
}

/**
 * Dummy Callback function
 * @param {Object} newState JSON object representing the new State
 */
async function changeColors(newState) {
    const lampOne = 12
    const lampTwo = 5
    const lampThree = 8
    const lampFour = 9
    const green = new LightState().rgb(103, 190, 97).alertShort()
    const api = await apiPromise

    for (let i = 0; i < newState.all[0].state.sequence.length; i++) {
        if (newState.all[0].state.sequence[i] === 0) {
            await api.lights.setLightState(lampOne, red)
            console.log("Setting Lamp 1 to red")
        } else if (newState.all[0].state.sequence[i] === 1) {
            await api.lights.setLightState(lampTwo, blue)
            console.log("Setting Lamp 2 to blue")
        } else if (newState.all[0].state.sequence[i] === 2) {
            await api.lights.setLightState(lampThree, yellow)
            console.log("Setting Lamp 3 to yellow")
        } else if (newState.all[0].state.sequence[i] === 3) {
            await api.lights.setLightState(lampFour, green)
            console.log("Setting Lamp 4 to green")
        }
        await sleep(500)
    }
}
