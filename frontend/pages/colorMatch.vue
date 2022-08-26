<template>

  <div>
    <p>
      Hallo Willkommen beoim Spiel. beweg deinen regler mit den zwei anderen spielern und erhalte die farbe der gluebirne.
    </p>
    <p v-if="color === undefined">Dir wird noch eine Frabe zugeordent.</p>
    <p v-if="!color === undefined">Du hast die Farbe {{ this.state.color }}</p>
  </div>

</template>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"

const riddleId = 'colorMatch'

export default {
  data() {
    return {
      state: {},
    }
  },

  async mounted() {
    await startRiddle(riddleId)
    this.state = getRiddleState(riddleId)
  }

}
</script>

<style scoped>

</style>
