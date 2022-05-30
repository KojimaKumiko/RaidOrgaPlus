<template>
	<div>
		<v-container grid-list-sm class="menu">
			<v-row dense>
				<v-col v-for="(role, index) in roles" :key="index" cols="4">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-avatar :size="30" class="icon" slot="activator" @click="pick(role)" :tile="true" v-on="on">
								<img :src="roleIcon(role.abbr)" />
							</v-avatar>
						</template>
						<span>{{ role.name }}</span>
					</v-tooltip>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import _icons from "../../services/icons";
	import { Role, ROLES } from "../../../../models/Rolle";

	export default Vue.extend({
		name: "MenuRoleComp",
		props: {
			showStar: Boolean,
		},
		methods: {
			roleIcon: function(name: string): string {
				return _icons.roleIcon(name);
			},
			pick: function(role: Role) {
				this.$emit("pick", role);
			},
		},
		computed: {
			roles: function() {
				let roles = ROLES.filter(r => r.visible).sort((a, b) => a.order - b.order);

				if (!this.showStar) {
					// filter out the Star Icon.
					roles = roles.filter(r => r.id != 7);
				}

				return roles;
			},
		},
	});
</script>

<style scoped lang="scss">
	.menu {
		background-color: $tabHeader;
	}

	.icon {
		margin-right: -1rem;
	}
</style>
