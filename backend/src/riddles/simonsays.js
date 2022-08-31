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
        if (state.active == undefined) {
            return {
                sequenceLength: 0,
                canSubmit: false,
                inGame: false,
            }
        }
        return {
            sequenceLength: state.active.state.sequence.length,
            inGame: state.active.state.inGame,
            canSubmit: state.active.state.canSubmit,
        }
    },
    phoneActions: {
        submit: async (states, input) => {
            let isCorrect = true
            for (let i = 0; i < states.active.state.sequence.length; i++) {
                if (input.length < i) {
                    isCorrect = false
                    break
                }
                isCorrect =
                    isCorrect && states.active.state.sequence[i] === input[i]
            }
            states.active.state.inGame = isCorrect

            console.dir(input.playerSequence)
            console.dir(states.active.state.sequence)
            if (states.active.state.inGame) {
                states.active.state.sequence.push(randomInt())
            }
            return states
        },
    },
    piActions: {
        deactiveLock: async (state) => {
            console.dir(state)
            if (state.length > 0) state[0].state.canSubmit = true
            return state
        },
    },
})
