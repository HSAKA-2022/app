import { riddle } from "../riddle"

const riddleId = "reaktionstest"
const schwelle = 250

export default riddle({
    riddleId,
    mode: "simultaneousSinglePlayer",
    start: (existing) => {
        return {}
    },
    solved: (states) => {
        if (states.length === 0) return

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
        getName: async (state, input) => {
            state.active.state.playername = input.playername
            return state
        },
    },
    leaderboardIncludesActive: true,
    getLeaderboard: (players) => {
        const sortedPlayers = players.sort(
            (a, b) => a.state.reactionspeed - b.state.reactionspeed
        )
        return sortedPlayers.map((x) => x.state)
    },
})
