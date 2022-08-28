import { registerCallback } from "../../src/statePollerService"
import { triggerAction } from "../../src/actionDispatch"
//import { GPIO } from "onoff"
import { logger } from "../../src/log"

const process = require("process")
const ws281x = require("@gbkwiatt/node-rpi-ws281x-native")

//const button = new GPIO(4, "in", "both")
const [ledChannel] = ws281x.init({
    freq: 800000,
    channels: [{ count: 10, gpio: 18, stripType: "sk6812-rgbw" }],
})

/**
 * Entrypoint into the Script
 */
export default async function () {
    //handleButtonPresses()
    await resetStateNow()
    await resetStateEvery60Seconds()
    await changeColorEvery20Seconds()
    registerCallback("guess", handleStateChange)
}

/**
 * Dummy Action Trigger function, calling the backend with a dummy payload
 */
function handleButtonPresses() {
    button.watch(function (err, value) {
        if (err) {
            logger.error(err)
            return
        }
        if (value == 1) {
            resetStateNow()
        }
    })
}

async function resetStateNow() {
    const payload = {}
    await triggerAction("guess", "reroll", payload)
}

/**
 * Dummy Callback function
 * @param {Object} newState JSON object representing the new State
 */
function handleStateChange(newState) {
    logger.info(newState)
    if (newState[0].state.guess === newState[0].state.goal) {
        turnLEDToColor(" #ff0000")
    } else if (newState[0].state.guess > newState[0].state.goal) {
        turnLEDToColor(" #FFFF00")
    } else {
        turnLEDToColor("0000FF")
    }
}

function turnLEDToColor(hexCode) {
    for (let i = 0; i < 10; i++) {
        ledChannel.array[i] = hexCode
    }
    logger.info("turning LED to color" + hexCode)
    ws281x.render()
}

async function resetStateEvery60Seconds() {
    setInterval(function () {
        resetStateNow()
    }, 60 * 1000)
}

async function changeColorEvery20Seconds() {
    setInterval(function () {
        const newState = [
            { state: { guess: Math.floor(Math.random() * 3), goal: 1 } },
        ]
        handleStateChange()
    }, 10 * 1000)
}

// Save game before restarting
process.once("SIGUSR2", function () {
    logger.info("SIGUR2 received")
    ws281x.reset()
    ws281x.finalize()
    logger.info("SIGUR2 finished")
})

process.once("SIGINT", function () {
    logger.info("SIGINT received")
    ws281x.reset()
    ws281x.finalize()
    logger.info("SIGINT finished")
})
