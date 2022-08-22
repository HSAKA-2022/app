<template>
    <div>{{ getOrCreateUserId() }}</div>
</template>
<style>
html,
body {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
}

#app {
    max-width: calc(100vw - 4rem);
}

.todos li label {
    width: 100%;
}

.todos li:hover {
    border-radius: 6px;
    background-color: #eee;
}

h1 {
    font-size: 2rem;
}

h2 {
    font-size: 1.7rem;
}

h3 {
    font-size: 1.5rem;
}

h4 {
    font-size: 1.3rem;
}
</style>

<script>
const SERVER_URL = "http://localhost:5000"
// const FRONTEND_URL = "http://192.168.161.102:3000/amogus"

//const SERVER_URL = "https://backend.burg.games"
const FRONTEND_URL = "https://burg.games/amogus"
const riddleId = "amogus"
import QrCode from "qrcode"

// from https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        (c) =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] &
                    (15 >> (c / 4)))
            ).toString(16)
    )
}

function getOrCreateUserId() {
    const existing = localStorage.getItem("userId")
    if (existing != undefined) return existing
    const newId = uuidv4()
    localStorage.setItem("userId", newId)
    return newId
}

function header() {
    return {
        Authorization: "User " + getOrCreateUserId(),
        "Content-Type": "application/json"
    }
}

function padWithZero(number) {
    return number < 10 ? "0" + number : number
}

async function getState() {
    const result = await fetch(SERVER_URL + "/" + riddleId, {
        headers: header()
    })
    return result.json()
}


export default {
    data() {
        return {}
    },
    methods: {
        getOrCreateUserId() {
            const existing = localStorage.getItem("userId")
            if (existing != undefined) return existing
            const newId = uuidv4()
            localStorage.setItem("userId", newId)
            return newId
        }
    }
}
</script>
