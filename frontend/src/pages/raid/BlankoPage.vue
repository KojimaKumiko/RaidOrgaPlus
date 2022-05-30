<template>
	<div>
		<div class="spinner" v-if="!bosses">
			<v-progress-circular indeterminate color="primary" />
		</div>
		<BlankoMenuWingComp v-if="bosses" v-bind:currentWing="wingFilter" v-on:pick="pick" />
		<v-container grid-list-md>
			<v-layout row wrap>
				<v-flex xs12 sm6 md4 xl3 v-for="boss in filteredBosses" v-bind:key="boss.id">
					<BlankoComp
						v-bind:raid="raid"
						v-bind:boss="boss"
						v-bind:elements="elements"
						v-bind:role="role"
						v-on:copyBlanko="copyBlanko"
					/>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import BlankoComp from "../../components/blanko/BlankoComp.vue";
	import _gamedata from "../../services/endpoints/gamedata";
	import _blankos from "../../services/endpoints/blankos";
	import BlankoMenuWingComp from "../../components/blanko/BlankoMenuWingComp.vue";
	import { Encounter } from "../../../../models/Encounter";
	import { blankoElement, userRaid } from "models/Types";
	import { wingStrike } from "../../../../models/Types";

	export default Vue.extend({
		name: "BlankoPage",
		components: { BlankoMenuWingComp, BlankoComp },
		data: () => ({
			wingFilter: null as wingStrike,
			elements: null as blankoElement[],
			bosses: [] as Encounter[],
		}),
		computed: {
			filteredBosses: function(): Encounter[] {
				if (!this.wingFilter || this.wingFilter.id === 0) {
					return this.bosses;
				}

				if (!this.wingFilter.isStrike) {
					return this.bosses.filter(b => b.wing === this.wingFilter.id);
				}
				else {
					return this.bosses.filter(b => b.strike === this.wingFilter.id);
				}
			},
			raid: function(): userRaid {
				return this.$vStore.getters.raid;
			},
			role: function(): number {
				return this.$vStore.getters.raidRole;
			},
		},
		methods: {
			pick: async function(wing: wingStrike): Promise<void> {
				this.wingFilter = wing;
			},
			copyBlanko: async function(info: number[]): Promise<void> {
				this.elements = await _blankos.copyFromTo(this.raid.id, info[0], info[1]);
			},
		},
		created: async function(): Promise<void> {
			this.elements = await _blankos.getAllElements(this.raid.id);
			this.bosses = await _gamedata.listEncounter();
		},
	});
</script>

<style scoped>
	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
