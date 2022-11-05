<template>
    <layout>
        <h1 class="title has-text-centered is-size-1">Schnitzeljagd</h1>
    
        <div v-if="state === null">
            <p>
                Loading... 
            </p>
        </div>

        <div v-if="state != null">
            <div v-if="!state.isActive"> 
                <p>Willkommen bei unserer Schnitzeljagd! 
                    Mithilfe der Hinweise 
                    kannst du sieben verschiedene QR-Codes auf dem Burggelände finden und scannen. 
                    Viel Sspaß!
                </p>

                <button class="button is-primary mt-2" @click="startGame">
                    Start
                </button>
             </div>

            <div v-if="state.isActive">
                <p class="is-size-3 has-text-centered " style="border: 2px solid black;">Hinweis: {{state.hint}}</p>

                <p class="has-text-right">{{state.number}}/{{state.total}}</p>
             </div>

             <div v-if="state.solved">
                <p>
                    Gut gemacht! Du hast alle Orte gefunden!
                </p>
            </div>
        </div>

    </layout>
</template>

<style>
</style>

<script>
import { startRiddle, doRiddleAction, getRiddleState, getUrlParams } from "../utils"

const riddleId = "schnitzeljagd"

export default {
    ssr: false,

    async mounted() {
        this.state = await getRiddleState(riddleId)
        console.log(this.state)

        const linkContent = getUrlParams()
        const secret = linkContent.get("secret")

        if (secret != undefined) {
            this.state = await doRiddleAction(riddleId, "ScanCode", { guessedSecret: secret })
            console.log(this.state)
        } 
    },

    data() {
        return {
            state: null
        }
    },
    
    methods: {
       async startGame() {
            this.state = await startRiddle(riddleId)
            console.log(this.state)
        }
    }
}
</script>