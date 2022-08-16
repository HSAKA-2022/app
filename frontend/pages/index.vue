<template>
  <layout class="content landing-page">
    <h1>HSAKA Frontend</h1>

    <p>
      Dies ist die Startseite des HSAKA-Frontends. Wenn du diese Seite siehst,
      hast du das Frontend erfolgreich gestartet!
    </p>

    <p>
      Im
      <span>pages</span>-Ordner findest du die Seiten für einzelne Rätsel. Wenn
      du im Browser den Namen der Datei (ohne die <span>.vue</span>-Endung)
      eingibst, gelangst du auf die Seite für dein Rätsel.
    </p>

    <p>
      Du kannst die folgenden Referenzen benutzen, um am Projekt zu arbeiten:
    </p>

    <ul>
      <li>
        <a href="https://devhints.io/vue" target="_blank">Vue Cheatsheet</a> -
        Schnelle Übersicht über Vue-Funktionen
      </li>

      <li>
        <a href="https://vuejs.org/guide/introduction.html" target="_blank"
          >Vue</a
        >
        - Vollständige Vue-Referenz
      </li>

      <li>
        <a href="https://bulma.io/documentation" target="_blank">Bulma</a> -
        CSS-Klassen und Styling
      </li>
    </ul>
  </layout>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
