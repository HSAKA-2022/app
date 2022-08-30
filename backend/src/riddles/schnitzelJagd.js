import { riddle } from "../riddle"

const riddleId = "schnitzelJagd"
const places = [
    {
        name: "Baenke an der Werkstatt",
        hint: "hier sitzen wir",
        secret:"a3dalaziza"
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
        hint: "Back to black",
       secret: "basha3a",
   },
    {
        name: "Halle",
        hint: "Hier wird mit Schnee geworfen",
       secret: "hatalfhatal",  
    },
    {
        name: "Wiese",
        hint: "An apple a day keeps the doctor away!",
        secret: "lehla2",
    }
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
            foundPlaces: []
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

        return {
            goal: players.active.state.goal,
            isActive: true
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
                    players.active.state.goal = Math.floor(Math.random() *  places.length)
                    players.active.state.foundPlaces.push(i)
               
                    while (foundPlaces.includes(players.active.state.goal)) {
                        players.active.state.goal = Math.floor(Math.random() *  places.length)
                    }     
                }
            }
            return players
        },
    },
    /**
     * Actions that can be performed in the real world on the pi
     */
    piActions: {
    },
    /**
     * Periodic functions that gets called ever {tickRateInMs} milliseconds
     * Can be used to implement timers and other periodic functions
     */
    tick: async (players) => {
        players[0].state.guess = Math.ceil(Math.random() * 100)
        return players
    },
    /**
     * Hov often {tick} gets called in milliseconds
     */
    tickRateInMs: 60 * 1000,
})
