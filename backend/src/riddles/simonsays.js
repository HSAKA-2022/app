import { riddle } from "../riddle"

const riddleId = "simon"

function randomInt(max = 4) {
    return Math.floor(Math.random() * max)
}

export default riddle({
    riddleId,
    start: (existing) => {
        if (existing.length === 0) {
            return {
                sequence: [randomInt(), randomInt(), randomInt()],
                inGame: true,
            }
        }
    },
    solved: (states) => {
        return !states[0].state.inGame
    },
    getter: (state) => {
        return {
            sequenceLength: state.active.state.sequence.length,
            inGame: state.active.state.inGame,
        }
    },
    phoneActions: {
        submit: async (players, input) => {
            players.active.state.inGame =
                input.playerSequence == players.active.state.sequence
            if (players.active.state.inGame) {
                players.active.state.sequence.push(randomInt())
            }
            return players
        },
    },
    piActions: {},
})
