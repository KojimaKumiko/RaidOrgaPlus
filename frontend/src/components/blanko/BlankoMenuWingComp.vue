<template>
	<v-menu>
		<template v-slot:activator="{ on }">
			<v-btn v-on="on" class="button">
				{{ buttonText }}
			</v-btn>
		</template>
		<v-list>
			<v-list-item v-for="wing in wings" :key="wing.id" @click="pick(wing)">
				<v-list-item-title>{{ tileText(wing) }}</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script lang="ts">
	import Vue, { PropType } from "vue";
	import { wingStrike } from "../../../../models/Types";
	import _gamedata from "../../services/endpoints/gamedata";

	export default Vue.extend({
		name: "BlankoMenuWingComp",
		props: {
			currentWing: Object as PropType<wingStrike>,
		},
		data: () => ({
			wings: [] as wingStrike[],
		}),
		computed: {
			buttonText: function(): string {
				if (!this.currentWing || this.currentWing.id === 0) {
					return "Wing auswählen";
				}

				if (!this.currentWing.isStrike) {
					return "Wing " + this.currentWing.id;
				} else {
					return "Strike " + this.currentWing.id;
				}
			},
		},
		methods: {
			pick: function(wing: wingStrike): void {
				this.$emit("pick", wing);
			},
			tileText: function(wing: wingStrike): string {
				if (wing.id === 0) {
					return "Alles anzeigen";
				}

				if (!wing.isStrike) {
					return "Wing " + wing.id;
				} else {
					return "Strike " + wing.id;
				}
			},
		},
		created: async function(): Promise<void> {
			const wings = await _gamedata.getWingsAndStrikes();
			const showAll = { id: 0 } as wingStrike;
			this.wings = [showAll].concat(wings);
		},
	});
</script>

<style scoped></style>
