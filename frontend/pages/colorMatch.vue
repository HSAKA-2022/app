<template>

  <div>
    <h1>Color Match</h1>
    <div v-if="!state.solved">
      <p>Willkommen beim Spiel Color Match. Versuche, dass beide Lampen die gleiche Farbe haben.</p>

      <!-- waiting queue -->
      <p v-if="state.color === undefined">Dir wird noch eine Farbe zugeordent...</p>

      <!-- in game page -->
      <div v-if="state.color !== undefined">
        <p>Du hast die Farbe <b>{{ colorDict[state.color] }}</b> erhalten.</p>
        <vue-slider v-model="currentTry" height="30"></vue-slider>
        <button class="button" @click="setTry" >Submit</button>
        <progress class="progress" :value="currentTry" max="255">15%</progress>
        <button
            class="button"
            @mousedown="startIncCurrentTry"
        >
          Increment
        </button>
        <button
            class="button"
            @mousedown="startDecCurrentTry"
        >
          Decrement
        </button>
      </div>

      </div>

    <!-- win page -->
    <div v-if="state.solved">
      <p>Durch Koordination und Zusammenarbeit habt ihr das Spiel gewonnen -> herzlichen Glückwunsch!</p>
    </div>
  </div>

</template>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/antd.css'

const riddleId = 'colorMatch'
const valueIntervalDuration = 40
let refreshIntervalId, valueIntervalId

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
      currentTry: 0,
    }
  },

  async mounted() {
    this.state = await startRiddle(riddleId)
    refreshIntervalId = setInterval(this.refreshState, 300)
  },

  methods: {
    async setTry() {
      this.state = await doRiddleAction(riddleId, "setCurrent", {
        current: this.currentTry
      })
    },

    async refreshState() {
      this.state = await getRiddleState(riddleId)
      if (this.state.solved) {
        clearInterval(refreshIntervalId)
      }
    },

    startIncCurrentTry() {
      this.stopValueInterval()
      valueIntervalId = setInterval(this.incCurrentValue, valueIntervalDuration)
    },

    startDecCurrentTry() {
      this.stopValueInterval()
      valueIntervalId = setInterval(this.decCurrentValue, valueIntervalDuration)
    },

    stopValueInterval() {
      clearInterval(valueIntervalId)
    },

    incCurrentValue() {
      if (this.currentTry >= 255) {
        this.currentTry = 255
        return
      }
      this.currentTry++
    },

    decCurrentValue() {
      if (this.currentTry <= 0) {
        this.currentTry = 0
        return
      }
      this.currentTry--
    }
  }

}
</script>

<style scoped>

</style>
