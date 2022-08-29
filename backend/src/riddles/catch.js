import { isConstructorDeclaration } from "typescript"
import { riddle } from "../riddle"

const riddleId = "catch"
const informatiker = {
    "ceb3b59a-2523-11ed-861d-0242ac120002": {
        name: "Ada",
    },
    "ceb3b6bc-2523-11ed-861d-0242ac120002": {
        name: "Alex",
    },
    "ceb3a3d4-2523-11ed-861d-0242ac120002": {
        name: "Bene",
    },
    "ceb3a672-2523-11ed-861d-0242ac120002": {
        name: "Björn",
    },
    "ceb3b7e8-2523-11ed-861d-0242ac120002": {
        name: "Emil",
    },
    "ceb3a906-2523-11ed-861d-0242ac120002": {
        name: "Farida",
    },
    "ceb3bf04-2523-11ed-861d-0242ac120002": {
        name: "Hannes",
    },
    "ceb3ad8e-2523-11ed-861d-0242ac120002": {
        name: "Hilmar",
    },
    "ceb3bdc4-2523-11ed-861d-0242ac120002": {
        name: "Jan",
    },
    "ceb3ab40-2523-11ed-861d-0242ac120002": {
        name: "Katharina",
    },
    "ceb3ac6c-2523-11ed-861d-0242ac120002": {
        name: "Leon",
    },
    "30ceb3b356-2523-11ed-861d-0242ac120002UV": {
        name: "Lukas",
    },
    "ceb3affa-2523-11ed-861d-0242ac120002": {
        name: "Mischa",
    },
    "ceb3b126-2523-11ed-861d-0242ac120002": {
        name: "Philipp",
    },
    "ceb3b932-2523-11ed-861d-0242ac120002": {
        name: "Sophia",
    },
    "ceb3aa1e-2523-11ed-861d-0242ac120002": {
        name: "Toby",
    },
    "ceb3b248-2523-11ed-861d-0242ac120002": {
        name: "Toplink",
    },
}

export default riddle({
    riddleId,
    start: (existingPlayers) => {
        return {
            infoIDs: {},
        }
    },
    solved: (players) => {
        return false
    },

    getter: (players) => {
        return {
            infoIDs: players.active.state.infoIDs,
        }
    },
    /**
     * Actions that can be performed on the phone
     */
    phoneActions: {
        /**
         * The player makes a catch
         */
        makeACatch: async (players, input) => {
            for (const ID in informatiker) {
                if (input.infoID === ID) {
                    console.dir(players)
                    if (!players.active.state.infoIDs[input.infoID])
                        players.active.state.infoIDs[input.infoID] = true
                }
            }
            return players
        },
    },
    /**
     * Actions that can be performed in the real world on the pi
     */
    piActions: {},
})
