import { riddle } from "../riddle"

const riddleId = "guess"

export default riddle({
    riddleId,
    /**
     * Starts the riddle for a new player
     */
    start: (existingPlayers) => {
        // Only one player can solve the riddle at a time
        if (existingPlayers.length >= 1) {
            return
        }
        return {
            goal: Math.ceil(Math.random() * 100),
        }
    },
    /**
     * Checks if the player has solved the riddle
     */
    solved: (players) => {
        return players[0].state.guess === players[0].state.goal
    },
    /**
     * Maps the player's guess to the riddle's state
     */
    getter: (players) => {
        return {
            guess: players.active.state.guess,
        }
    },

    /**
     * Actions that can be performed on the phone
     */
    phoneActions: {
        /**
         * The player makes a guess
         */
        makeAGuess: async (players, input) => {
            players.active.state.guess = input.guess
            return players
        },
    },
    /**
     * Actions that can be performed in the real world on the pi
     */
    piActions: {
        /**
         * The reroll buzzer is pressed
         */
        reroll: async (players) => {
            players[0].state.guess = Math.ceil(Math.random() * 100)

            return players
        },
    },
    /**
     * Periodic functions that gets called ever {tickRateInMs} milliseconds
     * Can be used to implement timers and other periodic functions
     */
    tick: async (players) => {
        if (players.length === 0) return

        players[0].state.guess = Math.ceil(Math.random() * 100)

        return players
    },
    /**
     * Hov often {tick} gets called in milliseconds
     */
    tickRateInMs: 60 * 1000,
})
