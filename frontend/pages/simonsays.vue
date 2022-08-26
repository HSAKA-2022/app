<template>
    <layout v-if="!state.solved">
        <p> Erinnerst du dich noch an das, was Simon mit den Lampen gemacht hat?^^<br>
        Gebe es in der richtigen Reihenfolge wieder! </p>

        <button class="button is-primary mt-2" @click="guessNumber">Zahl raten</button>

        <h1 v-if="state.guess != undefined">Du hast zuletzt {{ state.guess }} geraten.</h1>
    </layout>
</template>

<style>
</style>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"

const riddleId = "simon"

export default {
    async mounted() {
        this.state = await startRiddle(riddleId)
    },

    data() {
        return {
            state: {}
        }
    },
    methods: {
        async guessNumber() {
            if (this.numberInput == undefined) {
                return
            }

            this.state = await doRiddleAction(riddleId, "makeAGuess", {
                guess: this.numberInput,
            })
        }
    }

}
</script>