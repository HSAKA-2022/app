import { riddle } from "../riddle"
import { color } from "colorjs.io"

const riddleId = "colormatch"

const colors = ["red", "green", "blue"]

function getRandomColorValue() {
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
        const goal = new color(
            "sRGB",
            players[0].state.goal,
            players[1].state.goal,
            players[2].state.goal
        )
        const current = new color("sRGB", [
            players[0].state.current,
            players[1].state.current,
            players[2].state.current,
        ])
        console.log("IMPORTANT + goal: ", goal.deltaE(current))
        return goal.deltaE(current) < 10
        const matchExpr =
            Math.sqrt(
                Math.pow(players[0].state.current - players[0].state.goal, 2) +
                    Math.pow(
                        players[1].state.current - players[1].state.goal,
                        2
                    ) +
                    Math.pow(
                        players[2].state.current - players[2].state.goal,
                        2
                    )
            ) < 80

        // compare color component of each player
        return matchExpr
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
        } else if (players.all.length >= 3) {
            state = {
                gameState: players.all.length >= 3 ? 1 : 0,
                current: players.active.state.current,
                color: players.active.state.color,
            }
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
