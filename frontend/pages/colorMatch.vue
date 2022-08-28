<template>

  <div>
    <h1>Color Match</h1>
    <p>
      Willkommen beim Spiel Color Match. Versuche, dass beide Lampen die gleiche Farbe haben.
    </p>
    <p v-if="state.color === undefined">Dir wird noch eine Farbe zugeordent...</p>
    <div v-if="state.color !== undefined">
      <p>Du hast die Farbe <b>{{ colorGermanDict[state.color] }}</b> erhalten.</p>
      <input class="input is-primary" type="number" placeholder="Farbe">
    </div>
  </div>

</template>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"

const riddleId = 'colorMatch'

export default {
  data() {
    return {
      state: {},
      colorGermanDict: {
        red: 'rot',
        green: 'grün',
        blue: 'blau',
      }
    }
  },

  async mounted() {
    this.state = await startRiddle(riddleId)
  }

}
</script>

<style scoped>

</style>
