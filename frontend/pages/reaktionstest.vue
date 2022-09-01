<template>
    <layout v-if="!state.solved && !earlyClickNotification" class="buttons are-large">
        <h1 class="is-size-1 has-text-success">Reaktionstest</h1>

        <p>Willkommen, der Reaktionstest funktioniert, indem man auf den Button klickt, sobald dieser Grün wird. Das
            Ziel ist innerhalb von 250ms zu reagieren. Viel Spaß ;)</p>
        <p v-if="!isPlayerNameSubmitted" class="has-text-weight-bold">Gib deinen Namen ein: </p>

        <button v-if="!showPictureBool && buttonhide" class="chadButton button is-primary mt-2 mx-1 is-size-2"
                @click="earlyclick" style="background-color: #f44336;">
            {{ this.recentreactionspeed === 0 ? "..." : this.recentreactionspeed }} ms
        </button>

        <button v-if="showPictureBool" class="chadButton button is-primary mt-2 mx-1 is-size-2" @click="react"
                style="background-color: #4CAF50;">{{ this.recentreactionspeed === 0 ? "..." : this.recentreactionspeed
            }} ms
        </button>

        <input v-if="!isPlayerNameSubmitted" type="text" class="input is-primary mr-2" v-model="playername">

        <button v-if="!isPlayerNameSubmitted" :disabled="playername === undefined || playername.length < 1"
                class="button is-primary mt-2 mx-1" @click="sendPlayerName">Namen absenden
        </button>

        <button v-if="!buttonhide" :disabled="!isPlayerNameSubmitted"
                class="chadButton button is-primary mt-2 mx-1 is-size-2" @click="wait">START
        </button>

        <h1 v-if="state.reactionspeed != undefined">Du hast zuletzt
            {{ this.recentreactionspeed === 0 ? "..." : this.recentreactionspeed }} ms gebraucht.</h1>
        <h1 v-if="state.reactionspeed === undefined">Du hast den Reaktionstest noch nicht absolviert.</h1>
    </layout>

    <layout v-if="earlyClickNotification" class="buttons are-large">
        <h1 v-if="earlyClickNotification" class="is-size-2 has-text-danger-dark">Du hast zu früh geklickt! Klicke erst,
            wenn der Button grün wird!</h1>
        <button class="chadButton button is-primary mt-2 is-size-1" @click="retry">Nochmal versuchen</button>

    </layout>

    <layout v-if="state.solved" class="buttons are-large">
        <h1 class="is-size-2 has-text-success">Du hast {{ state.reactionspeed }}ms gebraucht!</h1>
        <button class="chadButton button is-primary mt-2 is-size-2" @click="showLeaderboard">Leaderboard</button>

        <table class="table" v-if="leaderboard != undefined">
            <thead>
            <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Reaction Time</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(line, index) in leaderboard">
                <td>{{ index + 1}}.</td>
                <td>{{ line.playername }}</td>
                <td>{{ line.reactionspeed }}</td>
            </tr>
            </tbody>
        </table>
    </layout>
</template>

<style>
    .chadButton {
        width: 90%;
        height: 500px;
    }

</style>

<script>
import { startRiddle, doRiddleAction, getRiddleState, getLeaderboard } from "../utils"

const riddleId = "reaktionstest"

export default {
    async mounted() {
        console.log("start")
        this.state = await startRiddle(riddleId)
        this.state.reactionspeed = this.state.reactionspeed || "..."

    },

    data() {
        return {
            state: {},
            reactionspeed: 0,
            firstDate: undefined,
            secondDate: undefined,
            showPictureBool: false,
            buttonhide: false,
            activeTimer: false,
            earlyClickNotification: false,
            waitTime: 0,
            leaderboard: undefined,
            recentreactionspeed: 0,
            playername: undefined,
            isPlayerNameSubmitted: false
        }
    },
    methods: {
        async sendPlayerName() {
            this.state = await doRiddleAction(riddleId, "getName", {
                playername: this.playername
            })
            this.isPlayerNameSubmitted = true
        },
        showPicture() {
            this.firstDate = new Date(),
                this.showPictureBool = true

        },
        wait() {
            this.waitTime = Math.random() * 3500 + 1000
            this.buttonhide = true
            this.activeTimer = setTimeout(() => {
                this.showPicture()
            }, this.waitTime)
        },
        earlyclick() {
            clearTimeout(this.activeTimer)
            this.earlyClickNotification = true
            this.activeTimer = setTimeout(() => {
                this.showPictureBool = false
                this.buttonhide = false
            }, 400)

        },
        async react() {
            this.wait()
            this.secondDate = new Date()
            this.showPictureBool = false

            this.recentreactionspeed = this.secondDate - this.firstDate 
            this.reactionspeed = this.reactionspeed === 0 ? 9999999999999 : this.reactionspeed
            if (this.recentreactionspeed <= this.reactionspeed) {
                this.reactionspeed = this.recentreactionspeed
                this.state = await doRiddleAction(riddleId, "react", {
                    reactionspeed: this.reactionspeed
                })
            }

        },
        retry() {
            this.earlyClickNotification = false


        },
        async showLeaderboard() {
            this.leaderboard = await getLeaderboard(riddleId)
        }
    }

}
</script>
