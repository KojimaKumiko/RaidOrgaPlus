<template>
	<div>
		<AlertComp v-bind:user="user" />
		<EinladungenComp class="einladungen" />
		<v-container grid-list-md>
			<v-layout row wrap>
				<v-flex xs12 xl6>
					<HomepageTermineComp />
				</v-flex>
				<v-flex xs12 xl6>
					<div v-if="hasNoApi">
						<p>
							Gib einen API-Key in den Einstellungen an, um hier deinen wöchentlichen Raid-Progress und
							Erfolge zu sehen!
						</p>
					</div>
					<div v-else>
						<ProgressOverviewComp v-bind:user="user" v-bind:ownProfile="true"> </ProgressOverviewComp>
					</div>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import AlertComp from "../components/homepage/AlertComp.vue";
	import EinladungenComp from "../components/homepage/EinladungenComp.vue";
	import HomepageTermineComp from "../components/homepage/HomepageTermineComp.vue";
	import ProgressOverviewComp from "../components/profile/ProgressOverviewComp.vue";
	import _users from "../services/endpoints/users";
	import { Spieler } from "models/Spieler";

	export default Vue.extend({
		name: "HomePage",
		components: { ProgressOverviewComp, HomepageTermineComp, EinladungenComp, AlertComp },
		data: () => ({
			hasNoApi: false,
		}),
		computed: {
			user: function(): Spieler {
				return this.$vStore.getters.loggedInUser;
			},
		},
		created: async function(): Promise<void> {
			this.hasNoApi = !(await _users.hasApi());
		},
	});
</script>

<style scoped>
	.einladungen {
		margin-bottom: 20px;
	}

	.progress {
		margin-top: 20px;
	}
</style>
