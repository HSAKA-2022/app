import { riddle } from "../riddle"

const riddleId = "colorMatch"

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
            }
        }
    },

    solved: (players) => {
        for (let i = 0; i < players.length; i++) {
            if (players[i].state.current !== players[i].state.goal) {
                return false
            }
        }
        return true
    },

    getter: (players) => {
        return {
            current: players.active.state.current,
            color: players.active.state.color,
        }
    },

    phoneActions: {
        setCurrent: (players, input) => {
            players.active.state.current = input.current
            return players
        },
    },
    piActions: {},
})
