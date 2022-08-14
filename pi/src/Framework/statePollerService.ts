import axios from "axios"
import { logger } from "./logger"
import { config } from "../config"
import deepEqual from "deep-equal"
/**
 * Dictionary of JSON Objects, describing the current State for each Riddle.
 * Keys are riddleIDs
 * @private
 * @var {Dictionary<Object>} dictOfCurrentState
 */
const dictOfCurrentState: { [name: string]: Object } = {}
/**
 * Dictionary of lists of functions
 * For each riddle, a list of callbackfunctions is kept
 * Keys are riddleIDs
 * @private
 * @var {Dictionary<Function[]>} dictOfCallbacks
 */
const dictOfCallbacks: { [name: string]: Function[] } = {}

/**
 * Starts Poll Service
 * Polls the current state every @config.statePollService.pollDelay miliseconds
 * Calls all callback functions attached to a riddle when the state of a riddle changes
 */
export async function runPollingService() {
    ;(function loop() {
        setTimeout(function () {
            const listOfRiddleIDs = Object.keys(dictOfCallbacks)
            logger.info(`Executing State Update for ${listOfRiddleIDs}`)
            for (var i = 0; i < listOfRiddleIDs.length; i++) {
                updateState(listOfRiddleIDs[i])
            }
            loop()
        }, config.statePollService.pollDelay)
    })()
}

/**
 * Add callback function to the riddle specified by riddleID
 * @param {string} riddleID
 * @param {function} callback
 * */
export function registerCallback(riddleID: string, callback: Function) {
    if (dictOfCallbacks[riddleID] == undefined) {
        dictOfCallbacks[riddleID] = [callback]
    } else {
        dictOfCallbacks[riddleID].push(callback)
    }
    updateState(riddleID)
}

/**
 * Removes callback function to the riddle specified by riddleID
 * @param {string} riddleID
 * @param {function} callback
 * */
export function removeCallback(riddleID: string, callback: Function) {
    var index = dictOfCallbacks[riddleID].indexOf(callback)
    dictOfCallbacks[riddleID].splice(index, 1)
}

/**
 * Checks if state has been updated, and calls @updateCallbacks if the state changed
 * @param {string} riddleID
 * */
function updateState(riddleID: string) {
    logger.info(`Updating State of ${riddleID}`)
    axios
        .get(config.statePollService.baseURL, {})
        .then((response) => {
            logger.http(
                `UpdateState for ${riddleID} :  ${response.status}-${response.statusText} : ${response.data}`
            )
            if (deepEqual(dictOfCurrentState[riddleID], response.data)) {
                logger.verbose(`State changed for ${riddleID}`)
                dictOfCurrentState[riddleID] = response.data
                updateCallbacks(riddleID)
            }
        })
        .catch((error) => {
            if (error.response != undefined)
                logger.error(
                    `UpdateState for ${riddleID}:  ${error.response.status}-${error.response.statusText} : ${error.response.data}`
                )
            else logger.error(`Error triggering Action: ${error}`)
        })
}

/**
 * Calls all the calback functions stored for the given riddleID, with the changed state
 * @param {string} riddleID
 * */
function updateCallbacks(riddleID: string) {
    logger.verbose(`Updating callbacks for ${riddleID}`)
    for (const callback of dictOfCallbacks[riddleID]) {
        callback(dictOfCurrentState[riddleID])
    }
}
