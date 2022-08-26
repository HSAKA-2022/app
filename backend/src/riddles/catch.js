import { riddle } from "../riddle"

const riddleId = "catch"
const informatiker = {
    "20AB": {
        name: Sophia,
    },
    "21CD": {
        name: Björn,
    },
    "22EF": {
        name: Farida,
    },
    "23GH":{
        name:Toby,
    }
}

export default riddle({
    riddleId,
    start: (existingPlayers) => {
        return {
            infoIDs: [],
        }
    },
    solved: (players) => {
        return false
    },
    /**
     * Maps the player's guess to the riddle's state
     */
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
         * The player makes a guess
         */
        makeACatch: async (players, input) => {
            for (const ID in informatiker) {
                if (input.infoID === ID) {
                    if (!players.active.state.infoIDs.includes(input.infoID))
                        players.active.state.infoIDs.push(input.infoID)
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
