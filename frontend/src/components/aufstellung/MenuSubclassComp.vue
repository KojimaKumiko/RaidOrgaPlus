<template>
	<div>
		<v-container grid-list-sm class="menu">
			<v-layout row wrap>
				<v-flex v-for="(clss, index) in classes" :key="index" xs4>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-avatar
								:size="30"
								:style="{ 'background-color': backgroundColor(index) }"
								@click="pick(clss)"
								@mouseover="enter(index)"
								@mouseleave="leave()"
								tile
								v-on="on"
							>
								<img :src="classIcon(clss.abbr)" />
							</v-avatar>
						</template>
						<span>{{ clss.name }}</span>
					</v-tooltip>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import _icons from "../../services/icons";
	import _gamedata from "../../services/endpoints/gamedata";
	import { Class } from "models/Klasse";

	export default Vue.extend({
		name: "MenuSubclassComp",
		props: {
			base: Number,
		},
		data: () => ({
			hovered: null as number,
			classes: [] as Class[],
		}),
		methods: {
			classIcon: function(name: string): string {
				return _icons.classIcon(name);
			},
			pick: function(clss: Class): void {
				this.$emit("pick", clss);
			},
			enter: function(index: number): void {
				this.hovered = index;
			},
			leave: function(): void {
				this.hovered = null;
			},
			isHovered: function(index: number): boolean {
				return this.hovered === index;
			},
			backgroundColor: function(index: number): string {
				if (this.isHovered(index)) {
					return this.darkenColor(this.classes[0].color);
				} else {
					return "";
				}
			},
			darkenColor: function(color: string): string {
				const rValue = color.slice(1, 3);
				const gValue = color.slice(3, 5);
				const bValue = color.slice(5, 7);
				const colors = [rValue, gValue, bValue];
				const newValue = colors.map(c => Math.floor(parseInt(c, 16) / 2).toString(16)).join("");
				return `#${newValue}`;
			},
		},
		created: async function() {
			this.classes = await _gamedata.getClassesForBase(this.base);
		},
	});
</script>

<style scoped lang="scss">
	.menu {
		background-color: $playerCard;
	}
</style>
