<template>
    <layout class="content landing-page">
        <div id="app">
            <div v-if="!loading">
                <div v-if="state.isRegistered == false">
                    <div class="card" v-if="secret != undefined && !state.alreadyStarted">
                        <header class="card-header">
                            <p class="card-header-title">Registrieren</p>
                        </header>
                        <div class="card-content">
                            <div class="field">
                                <label class="label">Name</label>
                                <div class="control">
                                    <input class="input" v-model="inputs.username" type="text" placeholder="Name" />
                                </div>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <button class="card-footer-item is-primary button" @click="register"
                                    :disabled="inputs.username == undefined || inputs.username == ''"
                                    v-if="secret != undefined">
                                Registrieren
                            </button>
                        </footer>
                    </div>
                    <div v-if="state.alreadyStarted" class="notification is-danger">
                        Das Spiel hat bereits angefangen :(
                    </div>
                    <div v-if="secret == undefined && !state.alreadyStarted"
                         class="notification is-info"
                    >
                        Bitte scanne einen QR Code um dich zu registrieren :)
                    </div>
                </div>
                <!--    ADMIN STUFF    -->
                <div
                    v-if="state.isAdmin"
                >
                    <section class="card my-3">
                        <header class="card-header">
                            <p class="card-header-title">Settings</p>
                        </header>
                        <div class="card-content">

                            <div v-if="new Date(state.startingAt) > new Date()">
                                <h2>
                                    Game has not started yet, {{ state.alive.length }}
                                    signups so far
                                </h2>
                                <div class="field">
                                    <label class="label">starting at</label>
                                    <div class="control">
                                        <input
                                            class="input"
                                            v-model="inputs.admin.startingAt"
                                            type="datetime"
                                        />
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">imposter amount</label>
                                    <div class="control">
                                        <input
                                            class="input"
                                            v-model="inputs.admin.imposter"
                                            type="number"
                                        />
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">initial kill cooldown (in seconds)</label>
                                    <div class="control">
                                        <input
                                            class="input"
                                            v-model="inputs.admin.initialKillCooldownInSeconds"
                                            type="number"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">kill cooldown (in seconds)</label>
                                <div class="control">
                                    <input
                                        class="input"
                                        v-model="inputs.admin.killCooldownInSeconds"
                                        type="number"
                                    />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">possible murderers per kill</label>
                                <div class="control">
                                    <input
                                        class="input"
                                        v-model="inputs.admin.possibleMurdersPerImposter"
                                        type="number"
                                    />
                                </div>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <a class="card-footer-item" @click="saveSettings">save</a>
                        </footer>
                    </section>
                    <section
                        class="card my-3"
                        style="display: flex; gap: 10px; flex-direction: column"
                    >
                        <header class="card-header"><p class="card-header-title">Meeting</p></header>

                        <div class="card-content">
                            <h4>Reports</h4>
                            <ul>
                                <li v-for="report in state.reports">
                                    <span v-if="report.body !== undefined">
                                        {{ report.reporter }} reported
                                        {{ report.body }}
                                    </span>
                                    <span v-if="report.body === undefined">
                                        {{ report.reporter }} called an emergency
                                        Meeting
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div class="card-content">
                            <h4>Alive Players</h4>
                            <div class="level"
                                 style="border-bottom: 1px solid #ebebeb"
                                 v-for="alive in state.alive.sort((a,b) => { if(a.name > b.name) return 1; else if (a.name === b.name) return 0; else return -1})">
                                <span class="level-left">{{ alive.name }}</span>
                                <button class="button level-right" @click="voteKick(alive)">
                                    vote kick
                                </button>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <a class="card-footer-item" @click="endMeeting">End meeting</a>
                        </footer>
                    </section>
                    <section class="section card my-3">
                        state: {{ state.gameState }} <br />
                        Alive: {{ state.alive.length }} <br />
                        Imposter: {{ state.imposterAlive }} <br />
                        Crew: {{ state.crewAlive }} <br />

                    </section>
                </div>

                <!--        USER STUFF-->

                <div v-if="!state.isAdmin && state.isRegistered">
                    <div v-if="state.isAlive">
                        <div class="message is-primary" v-if="new Date(state.startingAt) > new Date()">
                            <div class="message-header">
                                <p>
                                    Das Spiel startet bald
                                </p>
                            </div>
                            <div class="message-body">
                                Das Spiel startet um {{ new Date(state.startingAt).toLocaleString() }} (in ca. {{ ((new Date(state.startingAt) - new Date()) / 1000 / 60 / 60).toFixed() }} Stunden)
                            </div>
                        </div>

                        <div
                            class="card my-3"
                            v-if="secret != undefined && state.secret != secret && state.role === 'imposter'"
                        >
                            <header class="card-header">
                                <p class="card-header-title">Du willst jemanden Eliminieren?</p>
                            </header>
                            <div class="card-content">
                                <div class="field">
                                    <label class="label">Raum</label>
                                    <div class="control">
                                        <div class="select" style="width:100%">
                                            <select v-model="inputs.room" style="width:100%">
                                                <option
                                                    v-for="room in state.rooms"
                                                    :value="room"
                                                >
                                                    {{ room }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <footer class="card-footer">
                                <a
                                    class="card-footer-item"
                                    @click="kill"
                                    :disabled="inputs.room == undefined"
                                >
                                    Töten
                                </a>
                            </footer>
                        </div>
                        <div v-if="new Date(state.startingAt) < new Date()">
                            <div class="card my-3">
                                <header class="card-header">
                                    <p class="card-header-title">
                                        QR Code
                                    </p>
                                </header>
                                <div class="pt-1"
                                     style="display:flex; align-items: center; justify-content: center; overflow: hidden">
                                    <canvas id="canvas" style="margin:auto;" />
                                </div>
                            </div>
                            <h1 class="mb-2">There are Imposters Among Us</h1>

                            <span class="tag" @click="showRole" v-if="roleClicked < 5">
                                Klicke {{ 5 - roleClicked }} mal um deine Rolle anzuzeigen
                            </span>
                            <span class="tag is-danger" @click="hideRole" v-if="roleClicked >=5">
                                {{ state.role }}
                                <span class="icon-text">
                                  <span class="icon">
                                    <i class="fas fa-times fa-solid"></i>
                                  </span>
                                </span>
                            </span>

                            <div
                                @click="hideRole"
                                class="panel my-3"
                                :class="{
                                'is-success':new Date(state.imposter.killCooldown ) < new Date(),
                                'is-warning':new Date(state.imposter.killCooldown ) > new Date(),
                                }"
                                v-if="state.role === 'imposter' && roleClicked >= 5">
                                <p class="panel-heading level mb-0"
                                   v-if="new Date(state.imposter.killCooldown ) > new Date()"
                                >
                                    Du kannst in {{ getTimeDiff(new Date(state.imposter.killCooldown), new Date()) }}
                                    ({{ new Date(state.imposter.killCooldown).toLocaleTimeString() }}) wieder töten
                                    <span class="icon">
                                    <i class="fas fa-times fa-solid"></i>
                                </span>
                                </p>
                                <p class="panel-heading level mb-0"
                                   v-if="new Date(state.imposter.killCooldown ) < new Date()"
                                >
                                    Du kannst jetzt einen Crewmate töten
                                    <span class="icon-text">
                                  <span class="icon">
                                    <i class="fas fa-times fa-solid"></i>
                                  </span>
                                </span>
                                </p>

                                <a class="panel-block" @click.stop="showRole"
                                   v-if="roleClicked === 5">
                                    Klicke hier um die anderen Imposter zu sehen
                                </a>
                                <a class="panel-block" @click.stop="hideRole"
                                   v-if="roleClicked > 5">
                                    Klicke hier um die Karte zu schließen
                                </a>
                                <div v-if="roleClicked >= 6" class="panel-block"
                                     v-for="imposter in state.imposter.otherImposters">
                                    {{ imposter }}
                                </div>
                            </div>

                            <span v-if="state.calledEmergencyMeeting">Du wirst beim nächsten Morgenplenum sprechen</span>
                            <button
                                class="button"
                                @click="callEmergencyMeeting"
                                v-if="!state.calledEmergencyMeeting"
                            >
                                Notfall Meeting einberufen
                            </button>

                            <hr>

                            <h2>
                                Was muss ich tun?
                            </h2>
                            <p class="mt-4">
                                Als Crewmate ist es dein Ziel die Imposter zu finden und im Morgenplenum rauszuwählen (und natürlich zu überleben).
                                Um jemanden vorschlagen zu können musst du die Überreste eines Crewmates finden, indem du die QR Codes in den einzelnen Räumen von Burg Fürsteneck regelmäßig scannst. Sollte dort jemand von den Impostern eliminiert worden zu sein, kannst du dies melden und erhälst dann im nächsten Morgenplenum die Chance der versammelten Gemeinschaft jemanden zum rauswählen vorzuschlagen. Um das einfacher zu machen, wird dir zudem eine Liste von SpielerInnen angezeigt, von denen einer oder eine garantiert der Mörder ist. Du solltest also die SpielerInnen auf der Liste zur Rede stellen und schauen was sie so gemacht haben in letzter Zeit und dann deine Ergebnisse allen vorstellen.
                            </p>
                            <p class="mt-4">
                                Zusätzlich kannst du auch ohne Überreste zu finden jemanden vorschlagen, indem du ein Notfall Meeting einberufst. Beachte jedoch dass die Imposter ebenfalls Notfall Meetings einberufen und Überreste finden können, um die Crewmates auf eine falsche Fährte zu locken.
                            </p>
                            <p class="mt-4">
                                Als Imposter hingegen möchtest du möglichst viele QR Codes von Crewmates scannen um sie dann zu "töten". Beachte jedoch, dass du nicht jederzeit beliebig töten kannst, da es einen Cooldown gibt. Außerdem möchtest du natürlich keine Aufmerksamkeit auf dich ziehen.
                            </p>
                        </div>

                        <div class="my-6" v-if="state.roomInformation != undefined">

                            <h2 class="title is-3">{{ state.roomInformation.room.name }}</h2>

                            <p
                                class="subtitle is-3"
                                v-if="state.roomInformation.bodies.length == 0"
                            >
                                Der Raum ist leer.
                            </p>
                            <p
                                class="subtitle is-3"
                                v-if="(state.roomInformation?.bodies?.length ?? 0)> 0"
                            >
                                Oh, was liegt denn da auf dem Boden?
                            </p>
                            <div
                                class="panel is-primary"
                                style="border-bottom: 1px solid #ebebeb"
                                v-for="body in state.roomInformation.bodies"
                            >
                                <div class="panel-heading"
                                     style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
                                    <p>
                                        {{ body.name }}
                                    </p>
                                    <button
                                        class="button is-link"
                                        v-if="!body.reported"
                                        @click="reportBody(body)"
                                    >
                                        Melden
                                    </button>
                                </div>
                                <p
                                    class="panel-block"
                                    v-if="(body.possibleMurders?.length ?? 0) > 0"
                                >
                                    Mögliche Mörder
                                </p>
                                <div
                                    class="panel-block"
                                    v-for="possibleMurder in body.possibleMurders"
                                >
                                    {{ possibleMurder }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!state.isAlive">
                        <h1>Du bist leider gestorben :(</h1>
                    </div>
                </div>
            </div>
            <!--    {{state}}-->
        </div>
        <img id="amogus" style="display:none;"
             src="https://cdn.iconscout.com/icon/free/png-512/among-us-3187363-2669561.png" />
    </layout>
</template>
<style>
html,
body {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
}

#app {
    max-width: calc(100vw - 4rem);
}

.todos li label {
    width: 100%;
}

.todos li:hover {
    border-radius: 6px;
    background-color: #eee;
}

h1 {
    font-size: 2rem;
}

h2 {
    font-size: 1.7rem;
}

h3 {
    font-size: 1.5rem;
}

h4 {
    font-size: 1.3rem;
}
</style>

<script>
// const SERVER_URL = "http://192.168.161.102:5000"
// const FRONTEND_URL = "http://192.168.161.102:3000/amogus"

const SERVER_URL = "https://backend.burg.games"
const FRONTEND_URL = "https://burg.games/amogus"
const riddleId = "amogus"
import QrCode from "qrcode"

// from https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        (c) =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] &
                    (15 >> (c / 4)))
            ).toString(16)
    )
}

function getOrCreateUserId() {
    const existing = localStorage.getItem("userId")
    if (existing != undefined) return existing
    const newId = uuidv4()
    localStorage.setItem("userId", newId)
    return newId
}

function header() {
    return {
        Authorization: "User " + getOrCreateUserId(),
        "Content-Type": "application/json"
    }
}

function padWithZero(number) {
    return number < 10 ? "0" + number : number
}

async function getState() {
    const result = await fetch(SERVER_URL + "/" + riddleId, {
        headers: header()
    })
    return result.json()
}


export default {
    data() {
        const userId = getOrCreateUserId()
        return {
            scannedUser: new URLSearchParams(
                window.location.search
            ).get("scannedUser"),
            room: new URLSearchParams(window.location.search).get(
                "room"
            ),
            secret: new URLSearchParams(window.location.search).get(
                "secret"
            ),
            userId: userId,
            loading: true,
            state: undefined,
            inputs: {},
            roleClicked: 0
        }
    },
    methods: {
        async fetchState() {
            this.state = await getState(this.userId)
            this.loading = false
        },
        // Admin stuff
        async saveSettings() {
            const result = await fetch(
                `${SERVER_URL}/${riddleId}/changeSettings`,
                {
                    headers: header(),
                    method: "POST",
                    body: JSON.stringify({
                        ...this.inputs.admin
                    })
                }
            )
            this.state = await result.json()
        },

        async voteKick(user) {
            const approval = confirm(
                "Are you sure you want to vote kick " +
                user.name +
                "?"
            )

            if (!approval) return

            const result = await fetch(
                `${SERVER_URL}/${riddleId}/voteKillPlayer`,
                {
                    headers: header(),
                    method: "POST",
                    body: JSON.stringify({
                        playerId: user.id
                    })
                }
            )
            this.state = await result.json()
        },

        async endMeeting() {
            const approval = confirm("End meeting?")
            if (!approval) return

            const result = await fetch(
                `${SERVER_URL}/${riddleId}/closeMeeting`,
                {
                    headers: header(),
                    method: "POST",
                    body: JSON.stringify({})
                }
            )
            this.state = await result.json()
        },
        // User stuff
        async register() {
            await fetch(`${SERVER_URL}/${riddleId}/start`, {
                headers: header(),
                method: "POST"
            })
            const result = await fetch(
                `${SERVER_URL}/${riddleId}/register`,
                {
                    headers: header(),
                    method: "POST",
                    body: JSON.stringify({
                        name: this.inputs.username,
                        secret: this.secret
                    })
                }
            )
            this.state = await result.json()
            this.loading = false
        },

        async reportBody(body) {
            const result = await fetch(
                `${SERVER_URL}/${riddleId}/reportBody`,
                {
                    headers: header(),
                    method: "POST",
                    body: JSON.stringify({
                        bodyId: body.id
                    })
                }
            )
            this.state = await result.json()
        },

        async callEmergencyMeeting() {
            const approval = confirm("Möchtest du im nächsten Morgenplenum einen Slot zum Sprechen haben?")
            if (!approval) return
            const result = await fetch(
                `${SERVER_URL}/${riddleId}/callEmergencyMeeting`,
                {
                    headers: header(),
                    method: "POST",
                    body: JSON.stringify({})
                }
            )
            this.state = await result.json()
        },

        async kill() {
            const result = await fetch(
                `${SERVER_URL}/${riddleId}/kill`,
                {
                    headers: header(),
                    method: "POST",
                    body: JSON.stringify({
                        inRoom: this.inputs.room,
                        victimSecret: this.secret
                    })
                }
            )
            window.location.replace(location.pathname)
            this.state = await result.json()
        },

        // UI
        showRole() {
            this.roleClicked++
        },
        hideRole() {
            this.roleClicked = 0
        },
        getTimeDiff(a, b) {
            const diff = a - b
            const seconds = Math.floor(diff / 1000)
            const minutes = Math.floor(seconds / 60)
            const hours = Math.floor(minutes / 60)

            const hourString = hours > 0 ? hours + ":" : ""
            const minuteString = minutes > 0 ? padWithZero(minutes % 60) + ":" : ""
            const secondString = (minutes > 0 || hours > 0) ? padWithZero(seconds % 60) + "" : seconds + "s"
            return `${hourString}${minuteString}${secondString}`

        }
    },
    async created() {
        await this.fetchState(this.userId)
        if (this.state.isAdmin) {
            this.inputs.admin = {
                startingAt: this.state.startingAt,
                imposter: this.state.imposter,
                killCooldownInSeconds:
                this.state.killCooldownInSeconds,
                initialKillCooldownInSeconds:
                this.state.initialKillCooldownInSeconds,
                possibleMurdersPerImposter:
                this.state.possibleMurdersPerImposter
            }
        }
        if (this.room != undefined) {
            const result = await fetch(
                `${SERVER_URL}/${riddleId}/goIntoRoom`,
                {
                    headers: header(),
                    method: "POST",
                    body: JSON.stringify({
                        roomId: this.room
                    })
                }
            )
            window.location.replace(location.pathname)
            this.state = await result.json()
        }
        const canvasElement = document.getElementById("canvas")
        if (canvasElement != undefined) {
            const width = canvasElement?.clientWidth ?? 250
            QrCode.toCanvas(
                canvasElement,
                `${FRONTEND_URL}?secret=${this.state.secret}`,
                { width: width }
            )
            canvas.getContext("2d").drawImage(document.getElementById("amogus"), (width / 2) - 50, width - 100, 100, 100)
        }
        setInterval(() => {
            this.fetchState()
        }, 1000)
    }
}
</script>
