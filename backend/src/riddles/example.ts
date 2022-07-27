import { riddle } from "../riddle"

// TODO
// How to properly finish riddle


type RGB = "r" | "g" | "b"
const available = ["r", "g", "b"] as Array<RGB>

const riddleId = "rgb"
export default riddle<{ guess: number; rgb: RGB; goal: number },
    { isRunning: boolean; rgb?: RGB; guess?: number, joined: boolean }>({
    riddleId,
    start: async (existing) => {
        // If we have an existing running game, don't start for the new player
        if (existing.length >= 3) {
            return undefined
        }
        const chosen = existing.map((it) => it.state.rgb)
        const remaining = available.filter(
            (it) => chosen.every((c) => c !== it)
        )

        return {
            guess: 0,
            goal: Math.floor(Math.random() * 256),
            rgb: remaining[0]
        }
    },
    getter: (state) => {
        return (state.active == undefined ? { isRunning: state.others.length > 0, joined: false } : {
            joined: true,
            isRunning: state.others.length == 2,
            rgb: state.active.state.rgb,
            guess: state.active.state.guess
        })
    },
    solved: (state) => {
        return state.length === 3 && state.every((it) => it.state.guess == it.state.goal)
    },
    phoneActions: {
        setValue: async (state, value: {guess: number}) => {
            state.active.state.guess = value.guess

            return state
        },
        leave: async (state) => {
            // no hacks here
            state.active.isActive = false
            return state
        },
        cancelGame: async (state) => {
            // no hacks here
            state.active.isActive = false
            state.others.forEach((it) => (it.isActive = false))
            return state
        }
    },
    piActions: {}
})

// PI

function registerCallback<State>(
    riddleId: string,
    callback: (state: State) => Promise<void>
) {
}

function setColorForLamp(
    number: number,
    color: { r: number; g: number; b: number }
) {
}

export function mainPi() {
    registerCallback(
        "rgb",
        async (state: Array<{ guess: number; goal: number; rgb: RGB }>) => {
            if (state.length === 3) {
                // in a real game
                const color = state.reduce(
                    (acc, it) => ({ [it.rgb]: it.guess }),
                    {}
                ) as { r: number; g: number; b: number }
                const isSolved = state.every((it) => it.guess == it.goal)

                if (isSolved) {
                    // fette party blink blink
                    setColorForLamp(1, color)
                    setColorForLamp(2, { ...color, g: 0, b: 0 })
                    setColorForLamp(3, { ...color, r: 0, b: 0 })
                    setColorForLamp(4, { ...color, r: 0, g: 0 })
                } else {
                    setColorForLamp(1, color)
                    setColorForLamp(2, { ...color, g: 0, b: 0 })
                    setColorForLamp(3, { ...color, r: 0, b: 0 })
                    setColorForLamp(4, { ...color, r: 0, g: 0 })
                }
                return
            }

            if (state.length > 0) {
                // highlight one lamp per player
                state.map((_, index) =>
                    setColorForLamp(index + 1, { r: 0, g: 0, b: 0 })
                )
            } else {
                // idle  animation whatever
            }
        }
    )
}
