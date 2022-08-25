import { riddle } from "../riddle"

const riddleId = "guess"

export default riddle({
    riddleId,
    start: async (existing) => {
        return {
            goal: Math.ceil(Math.random() * 100),
        }
    },
    solved: async (state) => {
        return state.every((player) => player.state.guess === player.state.goal)
    },
    getter: async (state) => {
        return {
            guess: state.active.state.guess,
        }
    },
    phoneActions: {
        makeAGuess: async (state, { guess }) => {
            state.active.state.guess = guess
            return state
        },
    },
    piActions: {
        reset: async (state) => {
            state.forEach(
                (player) =>
                    (player.state.guess = Math.ceil(Math.random() * 100))
            )
            return state
        },
    },
    tick: async (state) => {
        state.forEach(
            (player) => (player.state.guess = Math.ceil(Math.random() * 100))
        )
        return state
    },
    tickRateInMs: 60 * 1000,
})
