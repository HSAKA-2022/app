<template>
  <layout>
    <h1 class="is-size-1 has-text-success">!!! RESET !!!</h1>
    <input
      class="input mt-2"
      type="string"
      placeholder="riddleId"
      v-model="riddleId"
    />
    <button class="button is-primary mt-2" @click="reset">Reset</button>
  </layout>
</template>

<style></style>

<script>
import { startRiddle, headers } from "../../utils"
import { useRuntimeConfig } from "#app"

const riddleId = "guess"

export default {
  async mounted() {
    this.state = await startRiddle(riddleId)
  },

  data() {
    return {
      riddleId: undefined,
    }
  },
  methods: {
    async reset() {
      const ok = confirm(`Reset ${this.riddleId}?`)
      if (!ok) {
        return
      }
      const c = useRuntimeConfig()
      const result = await fetch(`${c.serverUrl}/${riddleId}/admin/reset`, {
        method: "POST",
        headers: headers(),
      })

      return await result.json()
    },
  },
}
</script>
