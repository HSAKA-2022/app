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
                canSubmit: false,
            }
        }
    },
    solved: (states) => {
        if (states.length === 0) {
            return
        } else {
            return !states[0].state.inGame
        }
    },
    getter: (state) => {
        return {
            sequenceLength: state.active.state.sequence.length,
            inGame: state.active.state.inGame,
        }
    },
    phoneActions: {
        submit: async (states, input) => {
            states.active.state.inGame =
                input.playerSequence == states.active.state.sequence
            console.dir(input.playerSequence)
            console.dir(states.active.state.sequence)
            if (states.active.state.inGame) {
                states.active.state.sequence.push(randomInt())
            }
            return states
        },
    },
    piActions: {
        deactiveLock: async () => {
            canSubmit = true
            return canSubmit
        },
    },
})
