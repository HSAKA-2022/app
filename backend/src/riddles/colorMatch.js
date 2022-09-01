import { riddle } from "../riddle"
import { rgb2lab, deltaE } from "rgb-lab"

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
                deltaE: null,
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
        const matchExpr =
            Math.sqrt(
                (players[0].state.current - players[0].state.goal) ^
                    (2 + (players[1].state.current - players[1].state.goal)) ^
                    (2 + (players[2].state.current - players[2].state.goal)) ^
                    2
            ) < 100
        const deltaE2 = deltaE(
            rgb2lab([
                players[0].state.current,
                players[1].state.current,
                players[2].state.current,
            ]),
            rgb2lab([
                players[0].state.goal,
                players[1].state.goal,
                players[2].state.goal,
            ])
        )
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
        } else if (players.all.length < 3) {
            state = {
                gameState: players.all.length >= 3 ? 1 : 0,
                current: players.active.state.current,
                color: players.active.state.color,
                deltaE: undefined,
            }
        } else {
            state = {
                gameState: players.all.length >= 3 ? 1 : 0,
                current: players.active.state.current,
                color: players.active.state.color,
                deltaE: deltaE(
                    rgb2lab([
                        players.all[0].state.current,
                        players.all[1].state.current,
                        players.all[2].state.current,
                    ]),
                    rgb2lab([
                        players.all[0].state.goal,
                        players.all[1].state.goal,
                        players.all[2].state.goal,
                    ])
                ),
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
