import { registerCallback } from "../../src/statePollerService"
import { triggerAction } from "../../src/actionDispatch"
//import { GPIO } from "onoff"
import { logger } from "../../src/log"

const process = require("process")
const ws281x = require("rpi-ws281x-native")
const riddleId = "colormatch"

const ledChannel = ws281x(2, {
    brightness: 65,
    stripType: "sk6812-grbw",
})

/**
 * Entrypoint into the Script
 */
export default async function () {
    registerCallback(riddleId, handleStateChange)
}

/**
 * Dummy Callback function
 * @param {Object} newState JSON object representing the new State
 */
function handleStateChange(newState) {
    if (Array.isArray(newState) && newState.length === 0) return
    turnLEDToStateValue(newState, "goal", 0)
    turnLEDToStateValue(newState, "current", 1)
}

function turnLEDToColor(hexCode, ledIndex) {
    ledChannel.array[ledIndex] = hexCode
    ws281x.render()
}

function turnLEDToStateValue(newState, valueName, ledIndex) {
    const hexCode = getHexCode(newState, valueName)
    logger.info(
        `Setting LED: ${ledIndex}, with valueName: ${valueName}, to hexCode: ${hexCode}`
    )
    turnLEDToColor(hexCode, ledIndex)
}

function getHexCode(newState, valueName) {
    let hexCode = "0x"
    for (let i = 0; i < 3; i++) {
        if (newState[i].state[valueName] == null) {
            hexCode += "00"
        } else {
            if (newState[i].state[valueName] <= 16) {
                hexCode += "0"
            }
            hexCode += newState[i].state[valueName].toString(16)
        }
    }
    return hexCode
}

// Save game before restarting
process.once("SIGUSR2", function () {
    console.log("SIGUR2 received")
    ws281x.reset()
    ws281x.finalize()
    console.log("SIGUR2 finished")
})

process.once("SIGINT", function () {
    console.log("SIGINT received")
    ws281x.reset()
    ws281x.finalize()
    console.log("SIGINT finished")
})
