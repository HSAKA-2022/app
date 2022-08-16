<template>
  <div class="root">
    <NuxtPage />
  </div>
</template>

<style>
html, body {
  padding: 0;
  margin: 0;
}

body > div {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  overflow: hidden auto;
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
