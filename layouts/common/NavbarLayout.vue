<template>
	<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
		<div class="container">
			<div class="navbar-brand">
				<a class="navbar-item no-select" href="/" target="_blank"> Open Website </a>

				<a
          v-if="!noBurger"
					role="button"
					class="navbar-burger no-select"
					aria-label="menu"
					aria-expanded="false"
					data-target="navbarBasicExample"
				>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>

			<div id="navbarBasicExample" class="navbar-menu">
				<!-- burger section -->
				<slot />
			</div>
		</div>
	</nav>
</template>

<script>
export default {
	props: {
		noBurger: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		if (!this.noBurger) {
			this.$nextTick(function () {
				// Get all "navbar-burger" elements
				const $navbarBurgers = Array.prototype.slice.call(
					document.querySelectorAll(".navbar-burger"),
					0
				);

				// Add a click event on each of them
				$navbarBurgers.forEach((el) => {
					el.addEventListener("click", () => {
						// Get the target from the "data-target" attribute
						const target = el.dataset.target;
						const $target = document.getElementById(target);

						// Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
						el.classList.toggle("is-active");
						$target.classList.toggle("is-active");
					});
				});
			});
		}
	},
};
</script>

<style>
</style>