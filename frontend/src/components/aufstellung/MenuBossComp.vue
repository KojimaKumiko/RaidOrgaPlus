<template>
	<v-list>
		<v-list-item v-for="(boss, index) in bosses" :key="index" @click="pick(boss)">
			<v-list-item-title>{{ boss.name }}</v-list-item-title>
		</v-list-item>
	</v-list>
</template>

<script lang="ts">
	import Vue, { PropType } from "vue";
	import { Encounter } from "models/Encounter";

	export default Vue.extend({
		name: "MenuBossComp",
		props: {
			wing: Array as PropType<Encounter[]>,
			showFC: Boolean,
		},
		computed: {
			bosses: function(): Encounter[] {
				if (this.showFC) {
					let fc = { id: 0, name: "Full Clear", wing: null as number, strike: null as number } as Encounter;
					if (this.wing[0].wing != null) {
						fc.wing = this.wing[0].wing;
					} else {
						fc.strike = this.wing[0].strike;
					}

					return [fc, ...this.wing];
				} else {
					return this.wing;
				}
			},
		},
		methods: {
			pick: function(boss: Encounter) {
				this.$emit("pick", boss);
			},
		},
	});
</script>

<style scoped></style>
