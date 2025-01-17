<template>
	<v-app-bar app clipped-left>
		<v-btn icon v-if="loggedIn" @click.stop="$emit('toggleMenu')">
			<v-icon>menu</v-icon>
		</v-btn>
		<v-toolbar-title>RaidOrga+</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-dialog width="1200" max-width="85%" v-model="legalNoticeOpen">
			<template v-slot:activator="{ on }">
				<v-btn icon v-on="on">
					<v-icon>copyright</v-icon>
				</v-btn>
			</template>
			<v-card>
				<v-card-title />
				<v-card-text>
					<LegalNoticeComp />
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="legalNoticeOpen = false">
						Close
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<span v-if="loggedIn">
			<v-btn icon @click="showBuildCheck = !showBuildCheck">
				<v-icon>{{ buildCheckIcon }}</v-icon>
			</v-btn>
			<div class="buildCheckWarning" v-if="showWarning">
				<v-card class="mx-auto" max-width="344" outlined>
					<v-card-text v-if="!buildCheckSuccess" class="white--text">
						<p class="headline mb-7 font-weight-bold">Neue Version verfügbar!</p>
						<p>
							Deine Version: <span class="red--text">{{ frontendBuild }}</span>
						</p>
						<p>
							Aktuelle Version: <span class="green--text">{{ backendBuild }}</span>
						</p>
						<span>Refreshe deinen Browser oder klicke hier, um die neueste Version zu erhalten:</span>
					</v-card-text>
					<v-card-text v-else class="white--text">
						<p class="headline mb-5 font-weight-bold">Aktuelle Version installiert!</p>
						<p>An dieser Stelle erfährst du, sobald es eine neue Version von RaidOrga+ gibt.</p>
						<span
							>Aktuelle Version: <span class="green--text">{{ frontendBuild }}</span></span
						>
					</v-card-text>

					<v-card-actions v-if="!buildCheckSuccess">
						<v-btn text @click="refreshPage">Seite neu laden</v-btn>
					</v-card-actions>

					<v-card-text class="white--text">
						<v-dialog width="900" max-width="85%">
							<template v-slot:activator="{ on }">
								<span class="version" v-on="on">Changelog</span>
							</template>
							<ChangelogComp />
						</v-dialog>
					</v-card-text>
				</v-card>
			</div>
			<v-btn icon @click="logout">
				<v-icon>logout</v-icon>
			</v-btn>
		</span>
	</v-app-bar>
</template>

<script lang="ts">
	import Vue from "vue";
	import ChangelogComp from "@/components/menu/ChangelogComp.vue";
	import LegalNoticeComp from "@/components/legal/LegalNoticeComp.vue";
	import _users from "../../services/endpoints/users";
	import _cookies from "../../services/util/cookies";

	export default Vue.extend({
		name: "MenuToolbarComp",
		props: {
			loggedIn: Boolean
		},
		components: {
			ChangelogComp,
			LegalNoticeComp,
		},
		data: () => ({
			showBuildCheck: false,
			legalNoticeOpen: false,
		}),
		computed: {
			buildCheckSuccess: function(): boolean {
				return this.$vStore.getters.buildCheck;
			},
			buildCheckIcon: function(): string {
				return this.buildCheckSuccess ? "verified_user" : "update";
			},
			showWarning: function(): boolean {
				return this.showBuildCheck || !this.buildCheckSuccess;
			},
			frontendBuild: function(): string {
				return this.$vStore.getters.frontendBuild;
			},
			backendBuild: function(): any {
				return this.$vStore.getters.backendBuild;
			},
		},
		methods: {
			logout: async function(): Promise<void> {
				await _users.invalidateSession();
				_cookies.deleteCookie("session");
				window.location.reload();
			},
			refreshPage: function(): void {
				window.location.reload();
			}
		},
	});
</script>

<style scoped>
	.buildCheckWarning {
		top: 60px;
		right: 20px;
		position: absolute;
	}

	.version:hover {
		cursor: pointer;
	}

	.changelogDialog {
		width: 900px;
		max-width: 85%;
	}
</style>
