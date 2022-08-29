<template>
  <layout>
    <h1 class="has-text-centered">Gotta Catch'em All</h1>
    <h6 class="is-size-7 has-text-centered">
      01001001 01101110 01100110 01101111 00100000 01000101 01100100 01101001
      01110100 01101001 01101111 01101110
    </h6>
    <button v-if="code != undefined" @click="doCatch">catch</button>
    <table class="table table is-bordered table is-fullwidth has-text-centered">
      <tbody>
        <tr>
          <th>1</th>
          <th v-if="!state.infoIDs['ceb3b59a-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3b59a-2523-11ed-861d-0242ac120002']">
            Ada
          </th>
        </tr>
        <tr>
          <th>2</th>
          <th v-if="!state.infoIDs['ceb3b6bc-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3b6bc-2523-11ed-861d-0242ac120002']">
            Alex
          </th>
        </tr>
        <tr>
          <th>3</th>
          <th v-if="!state.infoIDs['ceb3a3d4-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3a3d4-2523-11ed-861d-0242ac120002']">
            Bene
          </th>
        </tr>
        <tr>
          <th>4</th>
          <th v-if="!state.infoIDs['ceb3a672-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3a672-2523-11ed-861d-0242ac120002']">
            Björn
          </th>
        </tr>
        <tr>
          <th>5</th>
          <th v-if="!state.infoIDs['ceb3b7e8-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3b7e8-2523-11ed-861d-0242ac120002']">
            Emil
          </th>
        </tr>
        <tr>
          <th>6</th>
          <th v-if="!state.infoIDs['ceb3a906-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3a906-2523-11ed-861d-0242ac120002']">
            Farida
          </th>
        </tr>
        <tr>
          <th>7</th>
          <th v-if="!state.infoIDs['ceb3bf04-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3bf04-2523-11ed-861d-0242ac120002']">
            Hannes
          </th>
        </tr>
        <tr>
          <th>8</th>
          <th v-if="!state.infoIDs['ceb3ad8e-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3ad8e-2523-11ed-861d-0242ac120002']">
            Hilmar
          </th>
        </tr>
        <tr>
          <th>9</th>
          <th v-if="!state.infoIDs['ceb3bdc4-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3bdc4-2523-11ed-861d-0242ac120002']">
            Jan
          </th>
        </tr>
        <tr>
          <th>10</th>
          <th v-if="!state.infoIDs['ceb3ab40-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3ab40-2523-11ed-861d-0242ac120002']">
            Katharina
          </th>
        </tr>
        <tr>
          <th>11</th>
          <th v-if="!state.infoIDs['ceb3ac6c-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3ac6c-2523-11ed-861d-0242ac120002']">
            Leon
          </th>
        </tr>
        <tr>
          <th>12</th>
          <th v-if="!state.infoIDs['30ceb3b356-2523-11ed-861d-0242ac120002UV']">
            ???
          </th>
          <th v-if="state.infoIDs['30ceb3b356-2523-11ed-861d-0242ac120002UV']">
            Lukas
          </th>
        </tr>
        <tr>
          <th>13</th>
          <th v-if="!state.infoIDs['ceb3affa-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3affa-2523-11ed-861d-0242ac120002']">
            Mischa
          </th>
        </tr>
        <tr>
          <th>14</th>
          <th v-if="!state.infoIDs['ceb3b126-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3b126-2523-11ed-861d-0242ac120002']">
            Philipp
          </th>
        </tr>
        <tr>
          <th>15</th>
          <th v-if="!state.infoIDs['ceb3b932-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3b932-2523-11ed-861d-0242ac120002']">
            Sophia
          </th>
        </tr>
        <tr>
          <th>16</th>
          <th v-if="!state.infoIDs['ceb3aa1e-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3aa1e-2523-11ed-861d-0242ac120002']">
            Toby
          </th>
        </tr>
        <tr>
          <th>17</th>
          <th v-if="!state.infoIDs['ceb3b248-2523-11ed-861d-0242ac120002']">
            ???
          </th>
          <th v-if="state.infoIDs['ceb3b248-2523-11ed-861d-0242ac120002']">
            Toplink
          </th>
        </tr>
      </tbody>
    </table>
  </layout>

  <layout> </layout>
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
  },

  data() {
    return {
      code: getUrlParams().get("code"),
      state: {
        infoIDs: {},
      },
    }
  },
  methods: {
    async doCatch() {
      this.state = await doRiddleAction(riddleId, "makeACatch", {
        infoID: this.code,
      })
    },
  },
}
</script>
