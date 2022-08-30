import { isConstructorDeclaration } from "typescript"
import { riddle } from "../riddle"

const riddleId = "catch"
const informatiker = {
    "76b8d9f5-7fa5-491b-9918-f55837e4212c": {
        name: "Ada",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "7bdb5477-a7e4-4b05-a1b6-7d785dd12d92": {
        name: "Alex",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "b7723245-3f44-440f-8ae7-88b02f68d3c8": {
        name: "Bene",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "c7a6525e8-151d-4a0f-8931-fdde63fce302": {
        name: "Björn",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "cde614b3-b09c-4145-bcb2-4b01cbc390ee": {
        name: "Emil",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "e4585e6e-5f03-4d7c-b42b-81cd8bc90bb6": {
        name: "Farida",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "c54b367a-2e96-4d0d-b310-fc31043b2606": {
        name: "Hannes",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "1aa5be55-ad4e-4e8b-ad78-da75263cbe42": {
        name: "Hilmar",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "33f01436-e4bd-435a-b0d7-63e6a8884cad": {
        name: "Jan",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "79cf39d5-4879-4b6f-80a6-7841bc3a16d7": {
        name: "Katharina",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "cac5fa29-b7d9-4626-a547-7c4277133c0d": {
        name: "Leon",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "abb7d5e7-8492-4246-ab74-f6b6765a8545": {
        name: "Lukas",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "1099e545-59c3-4e6b-a448-f7b6b5bc3dd0": {
        name: "Mischa",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "322778c1-799f-444e-99a0-66fa92e4c2a6": {
        name: "Philipp",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "ef884d80-852b-4619-90f5-454854e58890": {
        name: "Sophia",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "b2675dfe-2dbf-4a33-943f-a2fb4a9b5dd8": {
        name: "Toby",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "c2f2180f-c1de-49cd-8003-ff0472bb1d85": {
        name: "Toplink",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
}

export default riddle({
    riddleId,
    start: (existingPlayers) => {
        return {
            infoIDs: {},
            informatiker: informatiker,
        }
    },
    solved: (players) => {
        return false
    },

    getter: (players) => {
        return {
            infoIDs: players.active.state.infoIDs,
            informatiker: informatiker,
        }
    },
    phoneActions: {
        makeACatch: async (players, input) => {
            for (const ID in informatiker) {
                if (input.infoID === ID) {
                    if (!players.active.state.infoIDs[input.infoID])
                        players.active.state.infoIDs[input.infoID] = true
                }
            }
            return players
        },
        restart: async (players, input) => {
            players.active.state.infoIDs = {}
            return players
        },
    },
    piActions: {},
})
