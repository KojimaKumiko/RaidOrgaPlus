<template>
	<div>
		<v-container grid-list-sm class="menu">
			<v-layout row wrap>
				<v-flex v-for="(clss, index) in classes" :key="index" xs4>
					<v-menu
						:open-on-hover="!isTouch"
						:open-on-click="isTouch"
						:close-on-content-click="false"
						:open-delay="isTouch ? 0 : 200"
						@click.prevent=""
					>
						<template v-slot:activator="{ on }">
							<v-avatar :size="30" class="icon" v-on="on" :tile="true">
								<img :src="classIcon(clss.abbr)" />
							</v-avatar>
						</template>
						<MenuSubclassComp v-bind:base="clss.id" v-on:pick="pick" />
					</v-menu>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import _icons from "../../services/icons";
	import MenuSubclassComp from "./MenuSubclassComp.vue";
	import { Class } from "models/Klasse";
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const whatInput = require("what-input");

	export default Vue.extend({
		name: "MenuClassComp",
		components: { MenuSubclassComp },
		data: () => ({
			classes: [
				{ id: 1, abbr: "Ele" },
				{ id: 2, abbr: "Mes" },
				{ id: 3, abbr: "Nec" },
				{ id: 4, abbr: "Rgr" },
				{ id: 5, abbr: "Eng" },
				{ id: 6, abbr: "Thf" },
				{ id: 7, abbr: "War" },
				{ id: 8, abbr: "Gdn" },
				{ id: 9, abbr: "Rev" },
			],
			isTouch: false,
		}),
		methods: {
			classIcon: function(name: string): string {
				return _icons.classIcon(name);
			},
			pick: function(clss: Class): void {
				this.$emit("pick", clss);
			},
		},
		created: function(): void {
			this.isTouch = whatInput.ask() === "touch";
		},
	});
</script>

<style scoped lang="scss">
	.menu {
		background-color: $tabHeader;
	}

	.icon {
		margin-right: -22px;
	}
</style>
