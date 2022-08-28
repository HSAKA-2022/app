<template>
    <layout v-if="!state.solved">
        <button v-if="showPictureBool" class="button is-primary mt-2" @click="react">Reaction</button>
        <button class="button is-primary mt-2" @click="showPicture">show Picture</button>

        <h1 v-if="state.reactionspeed != undefined">Du hast zuletzt {{ state.reactionspeed }} ms gebraucht.</h1>
    </layout>

    <layout v-if="state.solved">
        <h1 class="is-size-1 has-text-success">Du hast unter 200ms geraten!</h1>
    </layout>
</template>

<style>
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
            reactionspeed: undefined,
            firstDate: undefined,
            secondDate: undefined,
            showPictureBool: false,
        }
    },
    methods: {
        showPicture() {
            this.firstDate = new Date(),
            this.showPictureBool = true
        },
        async react() {
            this.showPictureBool = false
            this.secondDate = new Date()
            this.reactionspeed = this.secondDate - this.firstDate
            this.state = await doRiddleAction(riddleId, "react", {
                reactionspeed: this.reactionspeed,
            })
        }
    }

}
</script>