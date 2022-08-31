<template>
  <layout>
    <h1 class="has-text-centered is-size-2">Gotta Catch'em All</h1>
    <h6 class="is-size-7 has-text-centered">
      01001001 01101110 01100110 01101111 00100000 01000101 01100100 01101001
      01110100 01101001 01101111 01101110
    </h6>
    <br />
    <button
      v-if="code != undefined"
      @click="doCatch"
      class="button is-success button is-small front-size is-size-5 is-fullwidth button is-rounded"
    >
      Catch!
    </button>
    <br />
    <p 
      v-if="Object.keys(state.infoIDs).length === 0 && Object.keys(state.informatiker).length > 0" 
      class="is-size-4 has-text-link has-text-weight-bold ">
      Fange Informatiker - scanne Ihren QR-Code im Namesschild!
    </p>
    <p
      class="has-text-success is-size-2 has-text-weight-bold"
      v-if="
        Object.keys(state.informatiker).length ===
          Object.keys(state.infoIDs).length &&
        Object.keys(state.infoIDs).length > 0
      "
    >
      Yay das sind alle Informatiker!
    </p>
    <br />
    <p class="is-size-7">
      (Tipp: du kannst dir Informationen anzeigen lassen, indem du auf die Namen in der Tabelle
      klickst.)
    </p>

    <table class="table is-bordered is-fullwidth has-text-centered">
      <tbody>
        <tr v-for="(info, key, index) in state.informatiker">
          <th>{{ index + 1 }}</th>
          <th v-if="!state.infoIDs[key]">???</th>
          <th @click="openModal(key)" v-if="state.infoIDs[key]">
            {{ info.name }}
          </th>
        </tr>
      </tbody>
    </table>

    <div v-if="activInfo" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content is-clipped">
        <div class="columns">
          <div class="column">
            <p class="image is-4by4">
              <img :src="state.informatiker[activInfo].bild" alt="." />
            </p>
          </div>
          <div class="column has-text-grey-lighter m-4">
            <h3>{{ state.informatiker[activInfo].name }}</h3>
            <ul>
              <li>Alter: {{ state.informatiker[activInfo].age }}</li>
              <li>
                Augenfarbe: {{ state.informatiker[activInfo].augenfarbe }}
              </li>
              <li>Schule: {{ state.informatiker[activInfo].schule }}</li>
              <li>Mukks: {{ state.informatiker[activInfo].mukks }}</li>
            </ul>
          </div>
        </div>
      </div>
      <button
        @click="closeModal()"
        class="modal-close is-large"
        aria-label="close"
      ></button>
    </div>
    <br />
    <button
      class="button is-danger is-outlined"
      @click="restart"
      v-if="Object.keys(state.infoIDs).length === 17"
    >
      <span>Restart</span>
      <span class="icon is-small">
        <i class="fas fa-times"></i>
      </span>
    </button>
  </layout>
</template>

<style></style>

<script>
import {
  startRiddle,
  doRiddleAction,
  getRiddleState,
  getUrlParams,
} from "../utils"

const riddleId = "catch"

export default {
  async mounted() {
    this.state = await startRiddle(riddleId)
    console.log(this.state)
  },

  data() {
    return {
      code: getUrlParams().get("code"),
      state: {
        infoIDs: {},
        informatiker: {},
      },
      activInfo: undefined,
    }
  },
  methods: {
    async doCatch() {
      this.state = await doRiddleAction(riddleId, "makeACatch", {
        infoID: this.code,
      })
    },
    openModal(key) {
      this.activInfo = key
    },
    closeModal() {
      this.activInfo = undefined
    },
    async restart() {
      if (confirm("Sicher?")) {
        this.state = await doRiddleAction(riddleId, "restart", {})
      }
    },
  },
}
</script>
