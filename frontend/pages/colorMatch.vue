<template>

    <layout>
        <h1>Color Match</h1>
        <!-- waiting queue -->
        <div v-if="state.gameState === 0">Warte auf weitere Spieler...</div>
        <div v-else-if="state.gameState === 2">Es läuft bereits ein Spiel. Bitte habe einen Moment Geduld...</div>
        <div v-else-if="state.gameState === 1">
            <div v-if="!state.solved">
                <p>
                    Willkommen beim Spiel Color Match. Euer Ziel ist es, beide Lampen in den gleichen Farbe leuchten zu
                    lassen.
                </p>
                <p>Du hast die Farbe <b>{{ colorDict[state.color] }}</b> erhalten.</p>

                <!-- slider -->
                <vue-slider style="position: relative; top: 24px" tooltip="none" :min="0" :max="255"
                            v-model="currentTry" height="4" :dotSize=30></vue-slider>
                <!-- progress bar -->
                <div>
                    <progress
                        style="position: relative"
                        :class="{'is-danger': state.color === 'red', 'is-success': state.color === 'green', 'is-info': state.color === 'blue'}"
                        class="progress"
                        :value="currentTry"
                        max="255"
                    >
                        15%
                    </progress>
                </div>
            </div>
            <!-- win page -->
            <div v-if="state.solved">
                <p>Durch Koordination und Zusammenarbeit habt ihr das Spiel gewonnen -> herzlichen Glückwunsch!</p>
            </div>
        </div>
    </layout>

</template>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"
import VueSlider from "vue-slider-component/dist-css/vue-slider-component.umd.min.js"
import "vue-slider-component/dist-css/vue-slider-component.css"
import "vue-slider-component/theme/antd.css"

const riddleId = "colormatch"
const valueIntervalDuration = 40
const updateCurrentTryIntervalDuration = 500
const refreshStateIntervalDuration = 300
let refreshIntervalId, valueIntervalId, setTryInteralId

export default {
    components: { VueSlider },
    data() {
        return {
            state: {},
            colorDict: {
                red: "rot",
                green: "grün",
                blue: "blau"
            },
            currentTry: 0 // null ?
        }
    },

    async mounted() {
        try {
            this.state = await startRiddle(riddleId)
            setTryInteralId = setInterval(this.setTry, updateCurrentTryIntervalDuration)
        } catch (error) {
            console.log(error)
        }
        refreshIntervalId = setInterval(this.refreshState, refreshStateIntervalDuration)
    },

    methods: {
        async setTry() {

            if (this.clientInGame()) {
                this.state = await doRiddleAction(riddleId, "setCurrent", {
                    current: this.currentTry
                })
            } else {
                this.state = await getRiddleState(riddleId)
            }
        },

        async refreshState() {
            this.state = await getRiddleState(riddleId)
            console.log(this.state.gameState)
            if (this.state.solved && typeof this.state.color != "undefined") {
                this.state.gameState = 1
                clearInterval(refreshIntervalId)
                clearInterval(setTryInteralId)
                return
            } else if (this.state.gameState === 2 && this.state.solved) {
                try {
                    this.state = await startRiddle(riddleId)
                } catch (error) {
                    console.log(error)
                }
            }
        },

        clientInGame() {
            return this.state.gameState === 1
        }
    }
}
</script>

<style scoped>

</style>
