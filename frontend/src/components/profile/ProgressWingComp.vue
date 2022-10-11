<template>
	<div class="wing" v-bind:class="{ 'colored-wing': isBuffWing || isEmboldenedWing }">
		<v-avatar :size="48" tile class="cotm" v-if="showCotmIcons">
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<img v-if="isBuffWing" :src="icon('cotm')" v-on="on" />
				</template>
				<span>Call of the Mists</span>
			</v-tooltip>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<img v-if="isEmboldenedWing" :src="icon('embold')" v-on="on" />
				</template>
				<span>Emboldened</span>
			</v-tooltip>
		</v-avatar>
		<ProgressBossComp
			class="boss"
			v-for="boss in bosses"
			v-bind:boss="boss"
			v-bind:progress="progress"
			:key="boss.name"
		/>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import ProgressBossComp from "./ProgressBossComp.vue";
	import _icons from "../../services/icons";

	export default Vue.extend({
		name: "ProgressWingComp",
		components: { ProgressBossComp },
		props: ["bosses", "progress", "wing", "maxWing"],
		methods: {
			icon: function(icon: string): string {
				return _icons.miscIcon(icon);
			},
		},
		computed: {
			isEmboldenedWing: function(): boolean {
				const timeRef = Number(new Date("2022-10-03T00:00:10"));
				const difference = Number(new Date()) - timeRef;
				const rotations = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
				const rotationWing = (rotations % this.maxWing) + 1;
				return this.wing === rotationWing;
			},
			isBuffWing: function(): boolean {
				const timeReference = Number(new Date("2022-09-26T00:00:10"));
				const difference = Number(new Date()) - timeReference;
				const rotations = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
				const rotationWing = (rotations % this.maxWing) + 1;
				return this.wing === rotationWing;
			},
			showCotmIcons: function(): boolean {
				return this.$vStore.getters.windowWidth > 369;
			},
		},
	});
</script>

<style scoped>
	.wing {
		border-radius: 15px;
		margin: 5px 0;
		padding-right: 8px;
	}

	@media only screen and (min-width: 600px) {
		.wing {
			padding: 0 8px;
		}
	}

	.colored-wing {
		background-color: #445570;
		box-shadow: 1px 1px 6px black;
	}

	.cotm {
		float: left;
		margin-left: 4px;
		margin-right: 8px;
		padding-top: 12px;
	}

	.boss {
		margin: 5px;
	}
</style>
