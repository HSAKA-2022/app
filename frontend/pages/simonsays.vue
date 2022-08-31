<template>
    <layout v-if="!state.solved">
        <div class="body">
            <header>
                <h1>Simon Says</h1>
                <p>Einige Lampen vor dir werden nacheinander aufleuchten.
                    <br>Merke dir die Lichterfolge, die abgespielt wird und gib sie danach
                    korrekt wieder ein, indem du auf den Kasten der jeweiligen Farbe klickst.
                    <br>Bevor du deine Eingabe abschickst, kannst du diese durch die "Löschen" Taste rückgängig machen.
                    <br>Klicke auf "Abschicken" um deine Antwort überprüfen zu lassen.
                    <br>Nach jedem erfolgreichen Versuch wird die Sequenz um ein Licht ergänzt.
                </p>
            </header>
            <div class="box">
                <div class="columns">
                    <div class="column">
                        <button :disabled="!state.canSubmit" class="red lampButton content"
                            @click="makeArray(0)"></button>
                    </div>
                    <div class="column">
                        <button :disabled="!state.canSubmit" class="blue lampButton content"
                            @click="makeArray(1)"></button>
                    </div>
                </div>
                <div class="columns">
                    <div class="column">
                        <button :disabled="!state.canSubmit" class="yellow lampButton content"
                            @click="makeArray(2)"></button>
                    </div>
                    <div class="column">
                        <button :disabled="!state.canSubmit" class="green lampButton content"
                            @click="makeArray(3)"></button>
                    </div>
                </div>

                <button :disabled="!state.canSubmit" class="button is-danger" @click="deleteTry">Löschen</button>

                <button :disabled="!state.canSubmit" class="button is-success" @click="submit">Abschicken</button>
                <div>
                    <p>Deine Eingaben {{ userMoves }}</p>
                    <div class="inputList" v-for="item in input"></div>
                    <div class="smallBox red" v-if="item === 0"></div>
                    <div class="smallBox blue" v-if="item === 1"></div>
                    <div class="smallBox yellow" v-if="item === 2"></div>
                    <div class="smallBox green" v-if="item === 3"></div>
                </div>
            </div>
        </div>
    </layout>

    <layout v-if="state.solved">
        <h1 class="is-size-1 has-text-danger">Du hast falsch geraten!</h1>
    </layout>
</template>

<style>
/* .body {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 100px;
} */

header {
    order: 0;
}

.inputList {
    display: inline-block;

}

.box {
    margin-top: 20px;
}

.lampButton {
    min-height: 100px;
    min-width: 200px;
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

.smallBox {
    height: 10px;
    width: 10px;
    margin-right: 5px;
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
                canSubmit: false,
            })
        },

        async deleteTry() {
            this.input.pop()
        }


    }

}
</script>