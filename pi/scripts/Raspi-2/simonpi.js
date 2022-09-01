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
const green = new LightState().rgb(103, 190, 97).on()
const red = new LightState().rgb(255, 56, 89).on()
const blue = new LightState().rgb(69, 162, 229).on()
const yellow = new LightState().rgb(254, 192, 9).on()

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
    await resetLamps()

    logger.info("Finished Setuo for Simon Says")
}
async function resetLamps() {
    const api = await apiPromise
    await api.lights.setLightState(lampOne, red)
    await api.lights.setLightState(lampTwo, blue)
    await api.lights.setLightState(lampThree, yellow)
    await api.lights.setLightState(lampFour, green)
    await sleep(1000)

    const off = new LightState().off()
    await api.lights.setLightState(lampOne, off)
    await api.lights.setLightState(lampTwo, off)
    await api.lights.setLightState(lampThree, off)
    await api.lights.setLightState(lampFour, off)
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
    if (newState.length === 0) {
        return
    }
    const api = await apiPromise
    // only show lights, if the game advanced
    if (newState[0].state.canSubmit) {
        return
    }
    if (newState[0].state.sequence.length === 3) {
        await resetLamps()
        await sleep(1000)
    }

    const on = new LightState().on().bri(255)
    const off = new LightState().off()
    for (let i = 0; i < newState[0].state.sequence.length; i++) {
        if (newState[0].state.sequence[i] === 0) {
            await api.lights.setLightState(lampOne, on)
            await sleep(200)
            await api.lights.setLightState(lampOne, off)
            console.log("Setting Lamp 1 to red")
        } else if (newState[0].state.sequence[i] === 1) {
            await api.lights.setLightState(lampTwo, on)
            await sleep(200)
            await api.lights.setLightState(lampTwo, off)
            console.log("Setting Lamp 2 to blue")
        } else if (newState[0].state.sequence[i] === 2) {
            await api.lights.setLightState(lampThree, on)
            await sleep(200)
            await api.lights.setLightState(lampThree, off)
            console.log("Setting Lamp 3 to yellow")
        } else if (newState[0].state.sequence[i] === 3) {
            await api.lights.setLightState(lampFour, on)
            await sleep(200)
            await api.lights.setLightState(lampFour, off)
            console.log("Setting Lamp 4 to green")
        }
        await sleep(800)
    }
    await triggerAction("simon", "deactiveLock")
}
