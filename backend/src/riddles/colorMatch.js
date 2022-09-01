import { riddle } from "../riddle"
import Color from "colorjs.io"

const riddleId = "colormatch"

const colorArray = ["red", "green", "blue"]

function getRandomColorValue() {
    return Math.ceil(Math.random() * 256) - 1
}

export default riddle({
    riddleId,
    start: (players) => {
        if (players.length < 3) {
            return {
                color: colorArray[players.length],
                goal: Math.random(),
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
        players.sort(
            (a, b) =>
                colorArray.indexOf(b.state.current) -
                colorArray.indexOf(a.state.color)
        )
        const goal = new Color("sRGB", [
            players[0].state.goal,
            players[1].state.goal,
            players[2].state.goal,
        ])
        const current = new Color("sRGB", [
            players[0].state.current / 256,
            players[1].state.current / 256,
            players[2].state.current / 256,
        ])
        console.log(
            "IMPORTANT " + players.active + " goal: ",
            goal.deltaE(current)
        )
        return goal.deltaE(current, "2000") < 15
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
