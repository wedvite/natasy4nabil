<template>
	<div class="columns">
		<div class="column is-one-fifth">
			<div class="select is-rounded is-fullwidth is-hidden-tablet">
				<select v-model="currentMenu" class="is-fullwidth">
					<option
						v-for="(list, index) in menuList"
						:key="index + 'dropdown'"
						:selected="currentMenu === list.value"
					>
						{{ list.label }}
					</option>
				</select>
			</div>
			<aside class="menu is-hidden-mobile">
				<!-- <p class="menu-label">General</p> -->
				<ul class="menu-list">
					<li v-for="(list, index) in menuList" :key="index">
						<a
							role="button"
							class="pointer"
							:class="{ 'is-active': currentMenu === list.value }"
							@click="currentMenu = list.value"
						>
							{{ list.label }}
						</a>
					</li>
				</ul>
			</aside>
		</div>
		<div class="column">
			<component :is="currentMenu" />
		</div>
	</div>
</template>

<script>
import { userData } from "~/wedvite.config.js";

import Wishlist from "~/components/User/Wishlist";
import Guestlist from "~/components/User/Guestlist/index";
import { head, lowerCase, remove, startCase } from "lodash";
import { mapState } from "vuex";

export default {
	layout: "user",
	middleware: ["authenticated"],
	components: { Wishlist, Guestlist },
	data() {
		return {
			currentMenu: startCase(this.$route.params.slug || "Wishlist"),
			menuList: [
				{ label: "Wishlist", value: "Wishlist" },
				{ label: "Guestlist", value: "Guestlist" },
			],
		};
	},
	computed: {
		...mapState({
			sectionStatus: (state) => state.info.section_status || {},
		}),
	},
	created() {
		this.$store.dispatch("setInfo", userData);
		
		if (!this.sectionStatus?.wishlist) {
			remove(this.menuList, { value: "Wishlist" });
			if (this.currentMenu === "Wishlist") {
				this.currentMenu = head(this.menuList)?.value || "";
			}
		}
	},
	watch: {
		currentMenu(nv) {
			history.pushState("", "", `/user/${lowerCase(nv)}`);
		},
	},
};
</script>

<style>
</style>