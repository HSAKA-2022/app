import { riddle } from "../riddle"

const riddleId = "colormatch"

const colors = ["red", "green", "blue"]

function getRandomColorValue() {
    return 4
    return Math.ceil(Math.random() * 256) - 1
}

export default riddle({
    riddleId,
    start: (players) => {
        if (players.length < 3) {
            return {
                color: colors[players.length],
                goal: getRandomColorValue(),
                current: null,
            }
        }
    },

    solved: (players) => {
        // only test if game is started
        if (players.length < 3) {
            return false
        }

        // only test after all players set a try
        for (let i = 0; i < players.length; i++) {
            if (players[i].state.current == null) {
                return false
            }
        }

        // compare color component of each player
        for (let i = 0; i < players.length; i++) {
            if (
                Math.abs(players[i].state.goal - players[i].state.current) > 25
            ) {
                return false
            }
        }

        return true
    },

    getter: (players) => {
        let state
        if (typeof players.active === "undefined") {
            state = {
                gameState: 2,
                // game state values
                // 0 - waiting for players
                // 1 - ingame
                // 2 - there is/was a game
            }
        } else {
            state = {
                gameState: players.all.length >= 3 ? 1 : 0,
                current: players.active.state.current,
                color: players.active.state.color,
            }
            console.dir(
                players.active.state.color + ": " + players.active.state.goal
            )
        }
        return state
    },

    phoneActions: {
        setCurrent: (players, input) => {
            players.active.state.current = input.current
            return players
        },
    },
    piActions: {},
})
