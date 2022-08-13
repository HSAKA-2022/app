<template>
  <section class="section">
    <NuxtPage />
  </section>
</template>

<style>
body {
  /* Apply system font stack */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}

html, body {
  padding: 0;
  margin: 0;
  overflow: auto;
}

.root {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}
</style>
