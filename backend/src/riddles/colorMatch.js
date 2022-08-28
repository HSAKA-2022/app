import { riddle } from "../riddle"

const riddleId = "colorMatch"

const colors = ["red", "green", "blue"]

function getRandomColorValue() {
    return Math.ceil(Math.random() * 256) - 1
}

function sumPlayerValue(players, valueName) {
    let sum = 0
    for (let i = 0; i < players.length; i++) {
        sum += players[i].state[valueName]
    }
    return sum
}

export default riddle({
    riddleId,
    start: (players) => {
        if (players.length < 3) {
            return {
                color: colors[players.length],
                goal: 0,
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

        // calc sum of goal and current values
        totalGoal = sumPlayerValue(players, "goal")
        totalCurrent = sumPlayerValue(players, "current")

        // compare goal and current values
        return Math.abs(totalCurrent - totalGoal) <= 30
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
