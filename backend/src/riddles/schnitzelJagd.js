import { TypeFormatFlags } from "typescript"
import { riddle } from "../riddle"

const riddleId = "schnitzeljagd"
const places = [
    {
        name: "Baenke an der Werkstatt",
        hint: "Wie eine Motte zur Flamme",
        secret: "a3dalaziza",
    },
    {
        name: "Torschaenke",
        hint: "Zisch!",
        secret: "masa2elnor",
    },
    {
        name: "Empfang",
        hint: "Willkommen an der Akademie",
        secret: "ezakasa7bi",
    },
    {
        name: "Buehne",
        hint: "Showtime",
        secret: "fananin",
    },
    {
        name: "Webraum",
        hint: "You gooo back to her and I go back to blackkkk...",
        secret: "basha3a",
    },
    {
        name: "Halle",
        hint: "Let the Schneeballschlacht begin",
        secret: "hatalfhatal",
    },
    {
        name: "Wiese",
        hint: "An apple a day keeps the doctor away!",
        secret: "lehla2",
    },
]

export default riddle({
    riddleId: riddleId,
    mode: "simultaneousSinglePlayer",
    /**
     * Starts the riddle for a new player
     */
    start: (existingPlayers) => {
        // Zahl generieren und Ort zuordnen
        return {
            goal: Math.floor(Math.random() * places.length),
            foundPlaces: [],
        }
    },
    /**
     * Checks if the player has solved the riddle
     */
    solved: (players) => {
        return players[0].state.foundPlaces.length === places.length
    },
    /**
     * Maps the player's guess to the riddle's state
     */
    getter: (players) => {
        if (players.active === undefined) {
            return {}
        }
        const goal = players.active.state.goal
        const foundPlaces = players.active.state.foundPlaces

        return {
            goal: goal,
            isActive: true,
            hint: places[goal].hint,
            number: foundPlaces.length,
            total: places.length,
        }
    },
    /**
     * Actions that can be performed on the phone
     */
    phoneActions: {
        /**
         * The player makes a guess
         */
        ScanCode: (players, input) => {
            const guessedSecret = input.guessedSecret

            for (let i = 0; i < places.length; i++) {
                const isSameSecret = guessedSecret === places[i].secret
                const isGoal = players.active.state.goal == i

                if (isSameSecret && isGoal) {
                    players.active.state.goal = Math.floor(Math.random() * places.length)
                    players.active.state.foundPlaces.push(i)

                    if (places.length != foundPlaces.length) {
                        while (players.active.state.foundPlaces.includes(players.active.state.goal)) {
                            players.active.state.goal = Math.floor(Math.random() * places.length)
                        }
                    }
                }
            }
            return players
        },
    },
})
