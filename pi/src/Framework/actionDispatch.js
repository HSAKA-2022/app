
import axios from 'axios';
import { logger } from './logger.js';
import { config } from '../config.js';


/**
 * Action Dispatcher
 * Calls the Backend, with the specified payload, targeting a given riddle/action combination
 * @param {String} riddleId 
 * @param {String} actionId 
 * @param {Object} payload JSON object to be send as payload
 */
export function triggerAction(riddleId, actionId, payload){
    // Build Connection String
    logger.info(`Triggering Action ${actionId} for riddle ${riddleId}`)
    const connectionString = `${ config.actionDispatch.baseURL }/${riddleId}/${actionId}`
    logger.debug(`ConnectionString: ${connectionString}, Payload: ${JSON.stringify(payload)}`)
    // Make REST Call
    axios
    .post(connectionString, payload)
    .then(response => {
        logger.http(`Post for ${riddleId}/${actionId}:  ${response.status}-${response.statusText} : ${response.data}`)
      }
    )
    .catch(error => {
        if(error.response != undefined) logger.error(`Post for ${riddleId}/${actionId}:  ${error.response.status}-${error.response.statusText} : ${error.response.data}`)
        else logger.error(`Error triggering Action: ${error}`)
    })
}