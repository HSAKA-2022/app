<template>
    <div style="display:flex; flex-wrap:wrap; flex-direction: row">
        <div v-for="secret in secrets" style="width: 3.5cm; height: 3.5cm;">
            <canvas :id="secret" width="3cm" height="3cm"></canvas>
        </div>
    </div>

    <img id="amogus" style="display:none;" src="https://cdn.iconscout.com/icon/free/png-512/among-us-3187363-2669561.png" />
</template>

<script>
const SERVER_URL = "http://192.168.161.102:5000"
const FRONTEND_URL = "oc.is/a"

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
    const base64String = btoa(String.fromCharCode.apply(null, randomBytes));
    return base64String.replace(/\+/g, "").replace(/\//g, "").replace(/=/g, "").slice(0, 10)
}

export default {
    data() {
        return {
            secrets: [...new Array(100)].map(() => secret())
        }
    },
    created() {
        setTimeout(() => {
            this.secrets.forEach((secret, index) => {
                console.dir(secret)
                const canvas = document.getElementById(secret)
                QrCode.toCanvas(canvas, FRONTEND_URL + "?secret=" + secret, {
                    width: 130,
                    height: 130
                })
                canvas.getContext("2d").drawImage(document.getElementById("amogus"), 40, 90, 50, 50)

            })
        }, 1000)
    }
}
</script>
