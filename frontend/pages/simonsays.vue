<template>
    <layout v-if="!state.solved">
        <header>
            <h1>Simon Says</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, nostrum, rem exercitationem ratione
                vitae magnam autem laboriosam non repellat voluptatibus illum explicabo nihil dolorem! In commodi
                maiores quia officia explicabo.</p>
        </header>
        <div class="box">
            <div class="tile is-vertical is-8">
                <button class="red lampButton content" @click="makeArray(0)">Lampe 1</button>
                <button class="blue lampButton content" @click="makeArray(1)">Lampe 2</button>
            </div>
            <div class="tile">
                <button class="yellow lampButton content" @click="makeArray(2)">Lampe 3</button>
                <button class="green lampButton content" @click="makeArray(3)">Lampe 4</button>
            </div>

            <button class="button is-danger" @click="deleteTry">Löschen</button>

            <button class="button is-success" @click="submit">Abschicken</button>
        </div>

        <p>Deine Eingaben {{  userMoves  }}</p>
        <ul>
            <li v-for="item in input">
                {{  item  }}
            </li>
        </ul>

    </layout>

    <layout v-if="state.solved">
        <h1 class="is-size-1 has-text-danger">Du hast falsch geraten!</h1>
    </layout>
</template>

<style>
.box {
    margin-top: 20px;
}

.lampButton {
    min-height: 100px;
}

.red {
    background-color: #FF3859;    
}

.blue {
    background-color: #45A2E5;
}

.yellow {
    background-color: #FEC009;
}

.green {
    background-color: #67BE39;
}
</style>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"

const riddleId = "simon"

export default {
    async mounted() {
        this.state = await startRiddle(riddleId)
        console.log(this.state)
    },

    data() {
        return {
            state: {},
            input: [],
            userMoves: ""
        }

    },

    methods: {
        async makeArray(whichButton) {
            this.input.push(whichButton)

        },

        async submit() {
            this.state = await doRiddleAction(riddleId, "submit", {
                playerSequence: this.input,
            })
        },

        async deleteTry() {
            this.input.pop()
        }


    }

}
</script>