<template>
    <layout v-if="!state.solved && state.inGame">
        <div class="body container.is-fullhd">
            <header>
                <h1>Simon Says</h1>
                <p>{{ playerInstructions }}</p>
            </header>
            <div class="box">
                <div class="columns">
                    <div class="column">
                        <button :disabled="!state.canSubmit" class="red lampButton content"
<<<<<<< HEAD
                                @click="makeArray(0)"></button>
=======
                            @click="makeArray(0)"></button>
                    </div>
                    <div class="column">
>>>>>>> simon
                        <button :disabled="!state.canSubmit" class="blue lampButton content"
                            @click="makeArray(1)"></button>
                    </div>
                </div>
                <div class="columns">
                    <div class="column">
                        <button :disabled="!state.canSubmit" class="yellow lampButton content"
<<<<<<< HEAD
                                @click="makeArray(2)"></button>
=======
                            @click="makeArray(2)"></button>
                    </div>
                    <div class="column">
>>>>>>> simon
                        <button :disabled="!state.canSubmit" class="green lampButton content"
                            @click="makeArray(3)"></button>
                    </div>
                </div>

                <button :disabled="!state.canSubmit" class="button is-danger" @click="deleteTry">Löschen</button>

                <!--                <button :disabled="!state.canSubmit" class="button is-success" @click="submit">Abschicken</button>-->
                <div>
                    <p v-if="state.canSubmit">Deine Eingaben {{ userMoves }}</p>
                    <div class="inputList" v-for="item in input">
                        <div class="smallBox red" v-if="item === 0"></div>
                        <div class="smallBox blue" v-if="item === 1"></div>
                        <div class="smallBox yellow" v-if="item === 2"></div>
                        <div class="smallBox green" v-if="item === 3"></div>
                    </div>
                </div>
            </div>
        </div>
    </layout>

    <layout v-if="!state.solved && !state.inGame">
        <header>
            <h1>Simon Says</h1>
            <p>{{ playerInstructions }}</p>
        </header>
        <p>Du hast leider falsch geraten!</p>
        <p>Deine Punktzahl liegt bei: {{ state.sequenceLength }}</p>
    </layout>

    <layout v-if="state.solved">
        <header>
            <h1>Simon Says</h1>
            <p>{{ playerInstructions }}</p>
        </header>
        <article class="message is-danger mb-0">
            <div class="message-header">
                <p>Fehler</p>
            </div>
            <div class="message-body">
                <p>Ein anderer Benutzer ist gerade mit dem Spiel verbunden</p>
                <p>Bitte versuche es später nochmal</p>
            </div>
        </article>
    </layout>
</template>

<style>
header {
    order: 0;
}

button:disabled {
    background-color: lightgrey;
}

.lampButton {
    border: none;
    border-radius: 5px;
}

.inputList {
    display: inline-block;

}

.box {
    margin-top: 20px;
}

.lampButton {
    min-height: 100px;
    width: 100%;
    max-width: 50%;
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

.column {
    align-items: center;
}
</style>

<script>
import { startRiddle, doRiddleAction, getRiddleState } from "../utils"

const riddleId = "simon"

export default {
    async mounted() {
        this.state = await startRiddle(riddleId)
        setInterval(async () => {
            try {
                this.state = await getRiddleState(riddleId)
            } catch (e) {
                console.error(e)
            }
        }, 1000)
    },

    data() {
        return {
            state: {},
            input: [],
            userMoves: "",
            playerInstructions: "Einige Lampen vor dir werden nacheinander aufleuchten. \
            \nMerke dir die Lichterfolge, die abgespielt wird und gib sie danach korrekt \
            wieder ein, indem du auf den Kasten der jeweiligen Farbe klickst. \nBevor du \
            deine Eingabe abschickst, kannst du diese durch die 'Löschen' Taste rückgängig \
            machen. \nNach jedem erfolgreichen Versuch wird die Sequenz um ein Licht ergänzt.",
        }

    },

    methods: {
        async makeArray(whichButton) {
            this.input.push(whichButton)
            if (this.input.length >= this.state.sequenceLength) {
                await this.submit()
            }

        },

        async submit() {
            this.state = await doRiddleAction(riddleId, "submit", {
                playerSequence: this.input,
                canSubmit: false
            })
            this.input = []
        },

        async deleteTry() {
            this.input.pop()
        }


    }

}
</script>
