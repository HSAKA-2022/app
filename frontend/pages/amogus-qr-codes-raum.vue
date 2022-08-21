<template>
    <div style="display:flex; flex-wrap:wrap; flex-direction: row">
        <div v-for="room in rooms" class="pagebreak"
             style="display:flex; flex-direction: column; align-items: center; width: 18cm; height: 25.4cm;">
            <canvas :id="room[0]" width="18cm" height="18cm"></canvas>
            <h1>{{ room[1].name }}</h1>
        </div>
    </div>

    <img id="amogus" style="display:none;"
         src="https://cdn.iconscout.com/icon/free/png-512/among-us-3187363-2669561.png" />
</template>

<style>
.pagebreak {
    clear: both;
    page-break-before: always;
}
h1 {
    font-weight: 800;
    font-size: 3rem;
}

/* page-break-after works, as well */
</style>
<script>
const SERVER_URL = "http://192.168.161.102:5000"
const FRONTEND_URL = "https://burg.games/amogus"

// const SERVER_URL = "https://backend.burg.games"
// const FRONTEND_URL = "https://burg.games/amogus"
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

function secret() {
    const randomBytes = crypto.getRandomValues(new Uint8Array(16))
    const base64String = btoa(String.fromCharCode.apply(null, randomBytes))
    return base64String.replace(/\+/g, "").replace(/\//g, "").replace(/=/g, "").slice(0, 10)
}

const rooms = {
    Meeting: {
        name: "Meeting"
    },
    "94FB7826-A85E-43AB-9DC9-16BE3C2742C0": {
        name: "Wiese"
    },
    "CAEFFE70-EAA2-45FC-BBA3-63AE3D320612": {
        name: "Burg innenhof"
    },
    "23CCABE9-6327-4088-A810-F347DFEAE426": {
        name: "Werkstatt"
    },
    "597FD4EA-9416-4617-98F1-5E0CA5F5592E": {
        name: "Webraum"
    },
    "EF8F8C6C-3A8A-4961-8B48-57C7A4F5FD23": {
        name: "9 Säulen raum"
    },
    "882607A7-C13D-4EB2-9D08-63FB49F4DC29": {
        name: "Herrenhaus (+ Zimmer)"
    },
    "045B1FB2-1B06-4BF9-B696-B946DE8F9F6D": {
        name: "Torschenke"
    },
    "0D630406-16B8-4CB1-9551-67419E02FAF7": {
        name: "Speisesaal"
    },
    "F1405B96-FB47-4CE6-84B2-A2CE03B1BCB9": {
        name: "Aquarium"
    },
    "606E8F89-4C41-4AEC-9A54-824614987E16": {
        name: "Halle"
    },
    "D8715BB3-A01C-43ED-B7C8-AAA4CB8FCFD1": {
        name: "vor der Halle (+ Zimmer)"
    },
    "715A8826-16C4-4DE7-B3B9-8436DE6B3C89": {
        name: "Spangenberg"
    },
    "0E38C254-6F56-4C86-A8BC-FC368081A299": {
        name: "Der andere von Spangenberg"
    },
    "19BD7A09-397D-4C66-B244-B41A7A595B36": {
        name: "Tanzplatz"
    }
}
export default {
    data() {
        return {
            rooms: Object.entries(rooms)
        }
    },
    created() {
        setTimeout(() => {
            this.rooms.forEach((room, index) => {
                const canvas = document.getElementById(room[0])
                QrCode.toCanvas(canvas, FRONTEND_URL + "?room=" + room[0], {
                    width: 700,
                    height: 700
                })
                canvas.getContext("2d").drawImage(document.getElementById("amogus"), 300, 600, 100, 100)

            })
        }, 1000)
    }
}
</script>
