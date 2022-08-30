import { isConstructorDeclaration } from "typescript"
import { riddle } from "../riddle"

const riddleId = "catch"
const informatiker = {
    "ceb3b59a-2523-11ed-861d-0242ac120002": {
        name: "Ada",
        age: "17",
        augenfarbe: "braun",
        schule: "Deutsche Schule Istanbul",
        mukks: "Elektronische Musik; Malen und Zeichnen",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3b6bc-2523-11ed-861d-0242ac120002": {
        name: "Alex",
        age: "16",
        augenfarbe: "grün-blau",
        schule: "Internatsschule Schloss Hansenberg",
        mukks: "Improtheater; Chor",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3a3d4-2523-11ed-861d-0242ac120002": {
        name: "Bene",
        age: "27",
        augenfarbe: "blau-grau",
        schule: "DevOps-Engineer",
        mukks: "Improtheater",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3a672-2523-11ed-861d-0242ac120002": {
        name: "Björn",
        age: "18",
        augenfarbe: "grün",
        schule: "Martin-Niemöller-Schule",
        mukks: "Elektronische Musik; Ton-Film-Impro",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3b7e8-2523-11ed-861d-0242ac120002": {
        name: "Emil",
        age: "16",
        augenfarbe: "grün-grau",
        schule: "Wolfgang Ernst Gymnasium",
        mukks: "3D-Modelle; Instrumentalmusik",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3a906-2523-11ed-861d-0242ac120002": {
        name: "Farida",
        age: "17",
        augenfarbe: "braun",
        schule: "DSB (Deutsche Schule der Borromarinnen)",
        mukks: "3D-Modelle; Blogging",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3bf04-2523-11ed-861d-0242ac120002": {
        name: "Hannes",
        age: "27",
        augenfarbe: "grün-grau",
        schule: "Software Consultant",
        mukks: "Elektronische Musik",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3ad8e-2523-11ed-861d-0242ac120002": {
        name: "Hilmar",
        age: "29",
        augenfarbe: "grün-grau",
        schule: "Software Consultant",
        mukks: "Akrobatik; Instrumentalmusik",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3bdc4-2523-11ed-861d-0242ac120002": {
        name: "Jan",
        age: "29",
        augenfarbe: "braun",
        schule: "Software Consultant",
        mukks: "3D-Modelle",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3ab40-2523-11ed-861d-0242ac120002": {
        name: "Katharina",
        age: "18",
        augenfarbe: "braun",
        schule: "Martin-Luther-Schule",
        mukks: "3D-Modelle; Physical Comedy",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3ac6c-2523-11ed-861d-0242ac120002": {
        name: "Leon",
        age: "28",
        augenfarbe: "braun-grün",
        schule: "Software Consultant & CEO",
        mukks: "-",
        bild: "/static/catch/Pokeball.png",
    },
    "30ceb3b356-2523-11ed-861d-0242ac120002UV": {
        name: "Lukas",
        age: "17",
        augenfarbe: "braun",
        schule: "Lessing Gymnasium",
        mukks: "Fotografie; Physical Comedy",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3affa-2523-11ed-861d-0242ac120002": {
        name: "Mischa",
        age: "28",
        augenfarbe: "braun",
        schule: "Software Consultant",
        mukks: "-",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3b126-2523-11ed-861d-0242ac120002": {
        name: "Philipp",
        age: "18",
        augenfarbe: "blau-grau",
        schule: "Gymnasium Nidda",
        mukks: "Improtheater; Instrumentalmusik",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3b932-2523-11ed-861d-0242ac120002": {
        name: "Sophia",
        age: "17",
        augenfarbe: "braun",
        schule: "Adorno-Gymnasium",
        mukks: "Improtheater; Ton-Film-Impro",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3aa1e-2523-11ed-861d-0242ac120002": {
        name: "Toby",
        age: "22",
        augenfarbe: "blau-grün",
        schule: "Software Development",
        mukks: "Akrobatik",
        bild: "/static/catch/Pokeball.png",
    },
    "ceb3b248-2523-11ed-861d-0242ac120002": {
        name: "Toplink",
        age: "16",
        augenfarbe: "braun",
        schule: "Internatsschule Schloss Hansenberg",
        mukks: "Improtheater; Physical Comedy",
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
