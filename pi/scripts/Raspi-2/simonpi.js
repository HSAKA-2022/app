import { registerCallback } from "../../src/statePollerService"
import { triggerAction } from "../../src/actionDispatch"
import { logger } from "../../src/log"
import { v3 } from "node-hue-api"
const LightState = v3.lightStates.LightState

const apiPromise = v3.api
    .createLocal("192.168.5.116")
    .connect("AT0cUBe8aB9zedDIkfkVi3l9jOkRwIrVhfzqTZlm")
/**
 * Entrypoint into the Script
 */
const green = new LightState().rgb(103, 190, 97).alertShort()
const red = new LightState().rgb(255, 56, 89).alertShort()
const blue = new LightState().rgb(69, 162, 229).alertShort()
const yellow = new LightState().rgb(254, 192, 9).alertShort()

const lampOne = 12
const lampTwo = 5
const lampThree = 8
const lampFour = 9

async function sleep(number) {
    return new Promise((resolve) => setTimeout(resolve, number))
}

export default async function () {
    logger.info("Starting Simon Says")
    await callActionOnRiddle1()
    await registerCallback("simon", changeColors)
    logger.info("Simon Says setting leds")
    const api = await apiPromise
    await api.lights.setLightState(lampOne, red.on())
    await api.lights.setLightState(lampTwo, blue.on())
    await api.lights.setLightState(lampThree, yellow.on())
    await api.lights.setLightState(lampFour, green.on())
    await sleep(1000)

    const off = new LightState().off()
    await api.lights.setLightState(lampOne, off)
    await api.lights.setLightState(lampTwo, off)
    await api.lights.setLightState(lampThree, off)
    await api.lights.setLightState(lampFour, off)

    logger.info("Finished Setuo for Simon Says")
}

/**
 * Dummy Action Trigger function, calling the backend with a dummy payload
 */
async function callActionOnRiddle1() {
    const payload = {}
}

/**
 * Dummy Callback function
 * @param {Object} newState JSON object representing the new State
 */
async function changeColors(newState) {
    const api = await apiPromise
    // only show lights, if the game advanced
    if (newState[0].state.canSubmit) {
        return
    }

    for (let i = 0; i < newState[0].state.sequence.length; i++) {
        if (newState[0].state.sequence[i] === 0) {
            await api.lights.setLightState(lampOne, red)
            console.log("Setting Lamp 1 to red")
        } else if (newState[0].state.sequence[i] === 1) {
            await api.lights.setLightState(lampTwo, blue)
            console.log("Setting Lamp 2 to blue")
        } else if (newState[0].state.sequence[i] === 2) {
            await api.lights.setLightState(lampThree, yellow)
            console.log("Setting Lamp 3 to yellow")
        } else if (newState[0].state.sequence[i] === 3) {
            await api.lights.setLightState(lampFour, green)
            console.log("Setting Lamp 4 to green")
        }
        await sleep(500)
    }
    await triggerAction("simon", "deactiveLock")
}
