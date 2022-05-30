<template>
	<div class="header">
		<v-avatar class="avatar">
			<img :src="icon()" />
		</v-avatar>
		<span>{{ boss.name }}</span>
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-menu :close-on-content-click="false" v-if="role > 0" class="button" v-on="on">
					<template v-slot:activator="{ on }">
						<v-btn icon v-on="on" class="button">
							<v-icon>input</v-icon>
						</v-btn>
					</template>
					<MenuWingComp v-on:pick="copyBlanko"> </MenuWingComp>
				</v-menu>
			</template>
			<span>Import von anderem Boss</span>
		</v-tooltip>
	</div>
</template>

<script lang="ts">
	import Vue, { PropType } from "vue";
	import _icons from "../../services/icons";
	import MenuWingComp from "../aufstellung/MenuWingComp.vue";
	import { Encounter } from "../../../../models/Encounter";

	export default Vue.extend({
		name: "BlankoHeaderComp",
		components: { MenuWingComp },
		props: {
			boss: Object as PropType<Encounter>,
			role: Number,
		},
		methods: {
			icon: function(): string {
				if (this.boss) return _icons.encIcon(this.boss.abbr);
				else return "";
			},
			copyBlanko: async function(info: Encounter): Promise<void> {
				this.$emit("copyBlanko", [info.id, this.boss.id]);
			},
		},
	});
</script>

<style scoped>
	.avatar {
		margin-right: 1rem;
	}

	.header {
		font-size: 20px;
		font-weight: bold;
		padding: 0.5rem 1rem;
	}

	.button {
		float: right;
		margin-top: 4px;
	}
</style>
