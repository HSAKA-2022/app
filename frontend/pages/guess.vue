<template>
  <layout v-if="!state.solved">
    Rate eine Zahl zwischen 0 und 100:
    <input
      class="input mt-2"
      type="number"
      placeholder="Zahl eingeben"
      v-model="numberInput"
    />

    <button class="button is-primary mt-2" @click="guessNumber">
      Zahl raten
    </button>

    <h1 v-if="state.guess != undefined">
      Du hast zuletzt {{ state.guess }} geraten.
    </h1>
  </layout>

  <layout v-if="state.solved">
    <h1 class="is-size-1 has-text-success">Du hast richtig geraten!</h1>
  </layout>
</template>

<style></style>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"

const riddleId = "guess"

export default {
  async mounted() {
    this.state = await startRiddle(riddleId)
  },

  data() {
    return {
      state: {},
      numberInput: undefined,
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
    },
  },
}
</script>
