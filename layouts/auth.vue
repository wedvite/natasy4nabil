<template>
	<div>
		<NavbarLayout no-burger />

		<nuxt />
	</div>
</template>

<script>
import NavbarLayout from "./common/NavbarLayout.vue";
export default {
	components: { NavbarLayout },
};
</script>