<template>
    <layout v-if="!state.solved && !earlyClickNotification" class="buttons are-large">
        <button v-if="!showPictureBool" class="chadButton button is-primary mt-2 mx-1 is-size-1" @click="earlyclick" style="background-color: #f44336;">{{ state.reactionspeed }} ms </button>
        <button v-if="showPictureBool" class="chadButton button is-primary mt-2 mx-1 is-size-1" @click="react" style="background-color: #4CAF50;">{{ state.reactionspeed }} ms </button>

        <button v-if="!buttonhide" class="chadButton button is-primary mt-2 mx-1 is-size-1" @click="wait">START</button>

        <h1 v-if="state.reactionspeed != undefined">Du hast zuletzt {{ state.reactionspeed }} ms gebraucht.</h1>
        <h1 v-if="state.reactionspeed === undefined">Du hast den Reaktionstest noch nicht absolviert.</h1>

    </layout>

    <layout v-if="earlyClickNotification" class="buttons are-large">

        <h1 v-if="earlyClickNotification" class="is-size-1 has-text-danger-dark">Du hast zu früh geklickt! Klicke erst, wenn der Button grün wird!</h1>
        <button class="chadButton button is-primary mt-2 is-size-1" @click="retry">Nochmal versuchen</button>

    </layout>

    <layout v-if="state.solved" class="buttons are-large">

        <h1 class="is-size-1 has-text-success">Du hast unter 200ms gebraucht!</h1>
        <h1 v-if="state.reactionspeed != undefined">Du hast zuletzt {{ state.reactionspeed }} ms gebraucht.</h1>
        <button class="button is-primary mt-2 is-size-1" @click="retry">Nochmal versuchen</button>

    </layout>
</template>

<style>
    .chadButton {
        width: 100%;
        height: 300px;
    }

</style>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"

const riddleId = "reaktionstest"

export default {
    async mounted() {
        this.state = await startRiddle(riddleId)
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
            waitTime: 0
        }
    },
    methods: {
        showPicture() {
            this.firstDate = new Date(),
            this.showPictureBool = true
            this.wait()
        },
        wait() {
            this.waitTime =  Math.random() * 3500 + 1000;
            this.buttonhide = true
            this.activeTimer = setTimeout(() => {
                this.showPicture()
            }, this.waitTime);
        },
        earlyclick() {
            clearTimeout(this.activeTimer)
            this.earlyClickNotification = true
            this.activeTimer = setTimeout(() => {
                this.showPictureBool = false
                this.buttonhide = false
            }, 400);

        },
        async react() {
            this.secondDate = new Date()
            this.showPictureBool = false
            this.reactionspeed = this.secondDate - this.firstDate - 100
            this.state = await doRiddleAction(riddleId, "react", {
                reactionspeed: this.reactionspeed,
            })
            this.state.reactionspeed = this.state.reactionspeed || 999999
        },
        retry() {
            this.earlyClickNotification = false
            this.state.solved = false
        }
    }

}
</script>