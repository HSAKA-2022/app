<template>

  <div>
    <h1>Color Match</h1>
    <div v-if="!state.solved">
      <p>Willkommen beim Spiel Color Match. Versuche, dass beide Lampen die gleiche Farbe haben.</p>
      <p v-if="state.color === undefined">Dir wird noch eine Farbe zugeordent...</p>
      <div v-if="state.color !== undefined">
        <p>Du hast die Farbe <b>{{ colorGermanDict[state.color] }}</b> erhalten.</p>
        <input class="input is-primary" type="number" placeholder="Farbe" v-model="currentTry">
        <button class="button is-primary" @click="setTry" >Submit</button>
      </div>
    </div>
    <div v-if="state.solved">
      <p>Durch Koordination und Zusammenarbeit habt ihr das Spiel gewonnen -> herzlichen Glückwunsch!</p>
    </div>
  </div>

</template>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"

const riddleId = 'colorMatch'
let intervalId

export default {
  data() {
    return {
      state: {},
      colorGermanDict: {
        red: 'rot',
        green: 'grün',
        blue: 'blau',
      },
      currentTry: 0
    }
  },

  async mounted() {
    this.state = await startRiddle(riddleId)
    intervalId = setInterval(this.refreshState, 300)
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
        clearInterval(intervalId)
      }
    }
  }

}
</script>

<style scoped>

</style>
