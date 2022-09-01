<template>

  <div class="p-5">
    <h1>Color Match</h1>
    <!-- waiting queue -->
    <div v-if="state.gameState === 0">
      Warte auf weitere Spieler...
    </div>

    <!-- white or after game -->
    <div v-else-if="state.gameState === 2">
      Es läuft bereits ein Spiel. Bitte habe einen Moment Geduld...
    </div>

    <!-- in game -->
    <div v-else-if="state.gameState === 1">
      <!-- win page -->
      <div v-if="state.solved">
        <h2>Durch Koordination und Zusammenarbeit habt ihr das Spiel <b>gewonnen</b><br> Herzlichen Glückwunsch!</h2>
      </div>


      <div v-if="!state.solved">
        <p>
          Willkommen beim Spiel Color Match. Euer Ziel ist es, beide Lampen in den gleichen Farbe leuchten zu lassen.
        </p>
        <p>Du hast die Farbe <b>{{ colorDict[state.color] }}</b> erhalten.</p>

      </div>

      <div class="mt-6">
        <!-- slider -->
        <vue-slider
            class="slider"
            v-model="currentTry"
            :class="{':disabled': !state.solved}"
            height="4"
            :min="0"
            :max="255"
            :dotSize=30
            :contained="true"
            :marks="sliderMarks"
        ></vue-slider>

        <!-- progress bar -->
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
  </div>

</template>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/antd.css'

const riddleId = 'colormatch'
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
        red: 'rot',
        green: 'grün',
        blue: 'blau',
      },
      currentTry: 0, // null ?
      sliderMarks: [0, 31, 63, 95, 127, 159, 191, 223, 255]
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
      }
      else if (this.state.gameState === 2 && this.state.solved) {
        try {
          this.state = await startRiddle(riddleId)
        } catch (error) {
          console.log(error)
        }
      }
    },

    clientInGame() {
      return this.state.gameState === 1;
    }
  },
}
</script>

<style scoped>
.slider {
  position: relative;
  top: 24px;
}
</style>
