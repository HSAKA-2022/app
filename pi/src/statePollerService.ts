import axios from "axios"
import { logger } from "./log"
import { config } from "./config"
import deepEqual from "deep-equal"
type callbackfunctions = (state: Record<string, unknown>) => void
/**
 * Dictionary of JSON Objects, describing the current State for each Riddle.
 * Keys are riddleIds
 * @private
 * @var {Dictionary<Record<string, unknown>>} dictOfCurrentState
 */
const dictOfCurrentState: { [name: string]: Record<string, unknown> } = {}
/**
 * Dictionary of lists of functions
 * For each riddle, a list of callbackfunctions is kept
 * Keys are riddleIds
 * @private
 * @var {Dictionary<Function[]>} dictOfCallbacks
 */
const dictOfCallbacks: { [name: string]: callbackfunctions[] } = {}

/**
 * Starts Poll Service
 * Polls the current state every @config.statePollService.pollDelay miliseconds
 * Calls all callback functions attached to a riddle when the state of a riddle changes
 */
export async function runPollingService() {
    setInterval(async function () {
        const listOfRiddleIDs = Object.keys(dictOfCallbacks)
        logger.info(`Executing State Update for ${listOfRiddleIDs}`)
        for (const id of listOfRiddleIDs) {
            await updateState(id)
        }
    }, config.statePollService.pollDelay)
}

/**
 * Add callback function to the riddle specified by riddleId
 * @param {string} riddleId
 * @param {function} callback
 * */
export async function registerCallback(
    riddleId: string,
    callback: callbackfunctions
) {
    if (dictOfCallbacks[riddleId] == undefined) {
        dictOfCallbacks[riddleId] = [callback]
    } else {
        dictOfCallbacks[riddleId].push(callback)
    }
    await updateState(riddleId)
}

/**
 * Removes callback function to the riddle specified by riddleId
 * @param {string} riddleId
 * @param {function} callback
 * */
export function removeCallback(riddleId: string, callback: callbackfunctions) {
    const index = dictOfCallbacks[riddleId].indexOf(callback)
    dictOfCallbacks[riddleId].splice(index, 1)
}

/**
 * Checks if state has been updated, and calls @updateCallbacks if the state changed
 * @param {string} riddleId
 * */
async function updateState(riddleId: string) {
    logger.info(`Updating State of ${riddleId}`)
    try {
        const response = await axios.get(
            `${config.actionDispatch.baseURL}/${riddleId}`
        )
        logger.http(
            `UpdateState for ${riddleId} :  ${response.status}-${response.statusText} : ${response.data}`
        )
        if (deepEqual(dictOfCurrentState[riddleId], response.data)) {
            logger.verbose(`State changed for ${riddleId}`)
            dictOfCurrentState[riddleId] = response.data
            updateCallbacks(riddleId)
        }
    } catch (error) {
        if (error.response != undefined)
            logger.error(
                `UpdateState for ${riddleId} :  ${error.response.status}-${error.response.statusText} : ${error.response.data}`
            )
        else logger.error(`Error updating State: ${error}`)
    }
}

/**
 * Calls all the calback functions stored for the given riddleId, with the changed state
 * @param {string} riddleId
 * */
function updateCallbacks(riddleId: string) {
    logger.verbose(`Updating callbacks for ${riddleId}`)
    for (const callback of dictOfCallbacks[riddleId]) {
        callback(dictOfCurrentState[riddleId])
    }
}
