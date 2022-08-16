<template>
	<div class="layout">
		<slot />
	</div>
</template>

<style scoped>
.layout {
	width: 60ch;
	max-width: calc(100% - 2rem);
	padding: 1rem;
	min-height: calc(100% - 2rem);
}
</style>
