import { riddle } from "../riddle"

const riddleId = "reaktionstest"
const schwelle = 200

export default riddle({
    riddleId,
    start: (existing) => {
        if (existing.length === 0) {
            return {}
        } else {
            return
        }
    },
    solved: (states) => {
        return states[0].state.reactionspeed <= schwelle
    },
    getter: (state) => {
        return {
            reactionspeed: state.active.state.reactionspeed,
        }
    },
    phoneActions: {
        react: async (state, input) => {
            state.active.state.reactionspeed = input.reactionspeed

            return state
        },
    },
})
