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
        bild: "",
    },
    "7bdb5477-a7e4-4b05-a1b6-7d785dd12d92": {
        name: "Alex",
        age: "16",
        augenfarbe: "grün-blau",
        schule: "Internatsschule Schloss Hansenberg",
        mukks: "Improtheater; Chor",
        bild: "",
    },
    "b7723245-3f44-440f-8ae7-88b02f68d3c8": {
        name: "Bene",
        age: "27",
        augenfarbe: "blau-grau",
        schule: "DevOps-Engineer",
        mukks: "Improtheater",
        bild: "",
    },
    "c7a6525e8-151d-4a0f-8931-fdde63fce302": {
        name: "Björn",
        age: "18",
        augenfarbe: "grün",
        schule: "Martin-Niemöller-Schule",
        mukks: "Elektronische Musik; Ton-Film-Impro",
        bild: "",
    },
    "cde614b3-b09c-4145-bcb2-4b01cbc390ee": {
        name: "Emil",
        age: "16",
        augenfarbe: "grün-grau",
        schule: "Wolfgang Ernst Gymnasium",
        mukks: "3D-Modelle; Instrumentalmusik",
        bild: "",
    },
    "e4585e6e-5f03-4d7c-b42b-81cd8bc90bb6": {
        name: "Farida",
        age: "17",
        augenfarbe: "braun",
        schule: "DSB (Deutsche Schule der Borromarinnen)",
        mukks: "3D-Modelle; Blogging",
        bild: "",
    },
    "c54b367a-2e96-4d0d-b310-fc31043b2606": {
        name: "Hannes",
        age: "27",
        augenfarbe: "grün-grau",
        schule: "Software Consultant",
        mukks: "Elektronische Musik",
        bild: "",
    },
    "1aa5be55-ad4e-4e8b-ad78-da75263cbe42": {
        name: "Hilmar",
        age: "29",
        augenfarbe: "grün-grau",
        schule: "Software Consultant",
        mukks: "Akrobatik; Instrumentalmusik",
        bild: "",
    },
    "33f01436-e4bd-435a-b0d7-63e6a8884cad": {
        name: "Jan",
        age: "29",
        augenfarbe: "braun",
        schule: "Software Consultant",
        mukks: "3D-Modelle",
        bild: "",
    },
    "79cf39d5-4879-4b6f-80a6-7841bc3a16d7": {
        name: "Katharina",
        age: "18",
        augenfarbe: "braun",
        schule: "Martin-Luther-Schule",
        mukks: "3D-Modelle; Physical Comedy",
        bild: "",
    },
    "cac5fa29-b7d9-4626-a547-7c4277133c0d": {
        name: "Leon",
        age: "28",
        augenfarbe: "braun-grün",
        schule: "Software Consultant & CEO",
        mukks: "-",
        bild: "",
    },
    "abb7d5e7-8492-4246-ab74-f6b6765a8545": {
        name: "Lukas",
        age: "17",
        augenfarbe: "braun",
        schule: "Lessing Gymnasium",
        mukks: "Fotografie; Physical Comedy",
        bild: "",
    },
    "1099e545-59c3-4e6b-a448-f7b6b5bc3dd0": {
        name: "Mischa",
        age: "28",
        augenfarbe: "braun",
        schule: "Software Consultant",
        mukks: "-",
        bild: "",
    },
    "322778c1-799f-444e-99a0-66fa92e4c2a6": {
        name: "Philipp",
        age: "18",
        augenfarbe: "blau-grau",
        schule: "Gymnasium Nidda",
        mukks: "Improtheater; Instrumentalmusik",
        bild: "",
    },
    "ef884d80-852b-4619-90f5-454854e58890": {
        name: "Sophia",
        age: "17",
        augenfarbe: "braun",
        schule: "Adorno-Gymnasium",
        mukks: "Improtheater; Ton-Film-Impro",
        bild: "",
    },
    "b2675dfe-2dbf-4a33-943f-a2fb4a9b5dd8": {
        name: "Toby",
        age: "22",
        augenfarbe: "blau-grün",
        schule: "Software Development",
        mukks: "Akrobatik",
        bild: "",
    },
    "c2f2180f-c1de-49cd-8003-ff0472bb1d85": {
        name: "Toplink",
        age: "16",
        augenfarbe: "braun",
        schule: "Internatsschule Schloss Hansenberg",
        mukks: "Improtheater; Physical Comedy",
        bild: "",
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
