import { riddle } from "../riddle"

const riddleId = "colorMatch"

function getRandomColorValue() {
    return Math.ceil(Math.random() * 256) - 1;
}

export default riddle({
    riddleId,
    start: (players) => {
        if (players.length === 3) {

            // map players with colors
            players[0].state.color = 'red'
            players[0].state.goal = getRandomColorValue()
            players[1].state.color = 'green'
            players[1].state.goal = getRandomColorValue()
            players[2].state.color = 'blue'
            players[2].state.goal = getRandomColorValue()
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
        }
    },
    piActions: {
    },
})
