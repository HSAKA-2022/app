<template>
    <layout class="content landing-page">
        <h1>Wilkommen bei den HSAKA burg.games!</h1>

        <p>
            Wir haben in der Kurszeit ein paar Minispiele entwickelt, die du hier ausprobieren kannst.
        </p>

        <p>
            Über die Burg verteilt findest du QR-Codes, die zu den einzelnen Spielen führen.
        </p>

        <p class="mt-6">
            Hier noch ein Tip, um loszulegen:
        </p>

        <h3 v-if="random === 0">
            Gucke doch mal im Marstall nach
        </h3>
        <h3 v-if="random === 1">
            Vielleicht findest Burghof ja etwas
        </h3>
        <h3 v-if="random === 2">
            Die Informatiker sind alle sehr sus
        </h3>
        <h3 v-if="random === 3">
            Schnitzel jagd man vor dem Essen
        </h3>
        <h3 v-if="random === 4">
            4
        </h3>
    </layout>
</template>

<style scoped>
.landing-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    data() {
        return {
            random: Math.floor(Math.random() * 5)
        }
    }
})
</script>
