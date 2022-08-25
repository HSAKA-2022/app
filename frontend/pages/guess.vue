<template>
  <layout class="content">
    <div
      class="section is-flex is-flex-direction-column"
      v-if="!state?.solved"
    >
      Rate eine Zahl zwischen 0 und 100:

      <input
        class="input mt-2"
        type="number"
        placeholder="Zahl eingeben"
        v-model="numberInput"
      />

      <button class="button is-primary mt-2" @click="makeGuess">
        Zahl raten
      </button>

      <h1 class="mt-4" v-if="state?.guess != undefined">
        Du hast zuletzt {{ state?.guess }} geraten.
      </h1>
    </div>

    <div class="section" v-if="state?.solved">
      <h1 class="has-text-success">Du hast das Rätsel gelöst!</h1>
    </div>
  </layout>
</template>

<script>
import { startRiddle, doRiddleAction } from "../utils"

const riddleId = "guess"

export default {
  data() {
    return {
      state: undefined,
      numberInput: undefined,
    }
  },

  async mounted() {
    this.state = await startRiddle(riddleId)
  },

  methods: {
    async makeGuess() {
      if (this.numberInput == undefined) {
        return
      }

      this.state = await doRiddleAction("guess", "makeAGuess", {
        guess: this.numberInput,
      })

      this.numberInput = undefined
    },
  },
}
</script>
