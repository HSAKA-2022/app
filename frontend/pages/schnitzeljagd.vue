<template>
    <layout>
        <h1 class="title has-text-centered ">Schnitzeljagd</h1>
    <p v-if="!state?.isActive">Willkommen bei unserer Schnitzeljagd! 
        Mithilfe der Hinweise 
        kannst du sieben verschiedene QR-Codes auf dem Burggelände finden und scannen. 
        Viel Spaß!</p>

    <button class="button is-primary mt-2" @click="startGame">
        Start
    </button>

    </layout>
</template>

<style>
</style>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"

const riddleId = "schnitzeljagd"

export default {
    async mounted() {
        this.state = await getRiddleState(riddleId)
        console.dir(this.state)
    },

    data() {
        return {
            state: null
        }
    },
    
    methods: {
       async startGame() {
            this.state = await startRiddle(riddleId)
            console.dir(this.state)
        }
    }
}
</script>