<template>
    <layout v-if="!state.solved">
        <button @click="makeArray">Lampe 1</button>
        <button>Lampe 2</button>
        <button>Lampe 3</button>
        <button>Lampe 4</button>
    </layout>

    <layout v-if="state.solved">
        <h1 class="is-size-1 has-text-success">Du hast richtig geraten!</h1>
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
        console.log(this.state)
        console.log("hey")
    },

    data() {
        return {
            state: {},
            input: {}
        }
        
    },
    methods: {
        async makeArray() {
            
            this.state = await doRiddleAction(riddleId, "submit", {
                guess: this.numberInput,
            })
        }
    }

}
</script>