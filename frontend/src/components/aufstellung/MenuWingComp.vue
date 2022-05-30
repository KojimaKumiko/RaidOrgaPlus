<template>
	<v-list>
		<v-list-item v-for="(wing, index) in wings" :key="index" @click="null">
			<v-menu>
				<template v-slot:activator="{ on }">
					<v-list-item-title v-on="on">Wing {{ index + 1 }}</v-list-item-title>
				</template>
				<MenuBossComp v-bind:wing="wing" v-bind:showFC="showFC" v-on:pick="pick"> </MenuBossComp>
			</v-menu>
		</v-list-item>
		<!-- <v-list-item> <v-divider /> </v-list-item> -->
		<v-list-item v-for="(strike, index) in strikes" :key="index" @click="null">
			<v-menu>
				<template v-slot:activator="{ on }">
					<v-list-item-title v-on="on">Strike {{ index + 1 }}</v-list-item-title>
				</template>
				<MenuBossComp v-bind:wing="strike" v-bind:showFC="showFC" v-on:pick="pick"> </MenuBossComp>
			</v-menu>
		</v-list-item>
	</v-list>
</template>

<script lang="ts">
	import Vue from "vue";
	import MenuBossComp from "./MenuBossComp.vue";
	import _gamedata from "../../services/endpoints/gamedata";
	import { Encounter } from "models/Encounter";

	export default Vue.extend({
		name: "MenuWingComp",
		props: {
			showFC: Boolean,
		},
		components: { MenuBossComp },
		data: () => ({
			wings: {} as Encounter[][],
			strikes: {} as Encounter[][]
		}),
		methods: {
			pick: function(info: Encounter): void {
				this.$emit("pick", info);
			},
		},
		created: async function(): Promise<void> {
			this.wings = await _gamedata.listEncounterGrouped();
			this.strikes = await _gamedata.listEncounterGroupedStrikes();
		},
	});
</script>

<style scoped></style>
