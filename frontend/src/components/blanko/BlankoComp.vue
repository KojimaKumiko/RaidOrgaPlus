<template>
	<div class="blanko">
		<BlankoHeaderComp v-bind:boss="boss" v-bind:role="role" v-on:copyBlanko="copyBlanko" />
		<v-container grid-list-md>
			<v-layout row wrap>
				<v-flex v-for="i in 10" :key="i" xs6>
					<BlankoElementComp
						v-bind:position="i"
						v-bind:raid="raid"
						v-bind:boss="boss"
						v-bind:propElement="propElement(i)"
						v-bind:role="role"
					/>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
	import { blankoElement, userRaid } from "models/Types";
	import Vue, { PropType } from "vue";
	import { Encounter } from "../../../../models/Encounter";
	import BlankoElementComp from "./BlankoElementComp.vue";
	import BlankoHeaderComp from "./BlankoHeaderComp.vue";

	export default Vue.extend({
		name: "BlankoComp",
		components: { BlankoHeaderComp, BlankoElementComp },
		props: {
			raid: Object as PropType<userRaid>,
			boss: Object as PropType<Encounter>,
			elements: Array as PropType<blankoElement[]>,
			role: Number
		},
		computed: {
			blankoElements: function(): blankoElement[] {
				if (this.boss && this.elements) {
					return this.elements.filter(e => e.enc === this.boss.id);
				} else {
					return [];
				}
			},
		},
		methods: {
			propElement: function(position: number): blankoElement {
				if (this.blankoElements) {
					return this.blankoElements.find(e => e.pos === position);
				}
			},
			copyBlanko: function(info: number[]): void {
				this.$emit("copyBlanko", info);
			},
		},
	});
</script>

<style scoped>
	.blanko {
		background-color: var(--v-playerCard-base);
		width: 100%;
		height: 100%;
		box-shadow: 1px 1px 3px black;
	}
</style>
