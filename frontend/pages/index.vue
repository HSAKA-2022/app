<template>
    <layout class="content landing-page">
        <h1>Wilkommen bei den den HSAKA burg.games!</h1>

        <p>
            Wir haben in der Kurszeit ein paar Rätsel entwickelt, die du hier ausprobieren kannst.
        </p>

        <p>
            Über die Burg verteilt findet ihr QR-Codes, die euch zu den einzelnen Rätseln führen.
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
            3
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
