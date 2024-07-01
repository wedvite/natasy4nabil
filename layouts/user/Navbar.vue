<template>
	<NavbarLayout>
		<!-- <div class="navbar-start">
			<div class="navbar-item has-dropdown is-hoverable">
				<a class="navbar-link"> Features </a>

				<div class="navbar-dropdown">
					<a class="navbar-item"> Wishlist </a>
					<a class="navbar-item"> Guestlist </a>
				</div>
			</div>
		</div> -->

		<div class="navbar-end">
			<div class="navbar-item">
				<div class="buttons">
					<button
						class="button is-light no-select"
						@click="doSignOut()"
					>
						<strong>Logout</strong>
					</button>
				</div>
			</div>
		</div>
	</NavbarLayout>
</template>

<script>
import NavbarLayout from "~/layouts/common/NavbarLayout";
export default {
	components: { NavbarLayout },
	methods: {
		doSignOut() {
			this.$store.dispatch("auth/signOut").then(() => {
				this.$router.push("/login");
			});
		},
	},
};
</script>

<style>
</style>