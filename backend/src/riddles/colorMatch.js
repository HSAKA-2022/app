import { riddle } from "../riddle"
import { rgb2lab, deltaE } from "rgb-lab"

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
        console.log(deltaE2)
        return deltaE < 0.4
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
                deltaE: deltaE(
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
