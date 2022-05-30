<template>
	<div class="toolbar">
		<div class="datetime" v-if="termin">
			{{ headline }}
		</div>
		<KommentarComp v-if="active === false" v-bind:termin="termin" v-bind:role="role" />

		<template v-if="active">
			<AnmeldungComp class="anmeldung" />
			<ListAnmeldungComp class="anmeldungen" />
			<p></p>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn icon @click="refresh" v-on="on">
						<v-icon>refresh</v-icon>
					</v-btn>
				</template>
				<span>Refresh</span>
			</v-tooltip>
			<template v-if="role > 0">
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-menu :close-on-content-click="false" v-on="on">
							<template v-slot:activator="{ on }">
								<v-btn icon v-on="on">
									<v-icon>add</v-icon>
								</v-btn>
							</template>
							<MenuWingComp v-bind:showFC="true" v-on:pick="addBoss" />
						</v-menu>
					</template>
					<span>Bosse hinzufügen</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon @click="toggleLocked" v-on="on">
							<v-icon>{{ lockIcon }}</v-icon>
						</v-btn>
					</template>
					<span>Editieren sperren</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon @click="openErsatzDialog" v-on="on">
							<v-icon>perm_identity</v-icon>
						</v-btn>
					</template>
					<span>Ersatzspieler</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon @click="openShareDialog" v-on="on">
							<v-icon>share</v-icon>
						</v-btn>
					</template>
					<span>Aufstellung teilen</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon @click="openArchiveDialog" v-on="on">
							<v-icon>send</v-icon>
						</v-btn>
					</template>
					<span>Termin archivieren</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon color="red" @click="openDeleteDialog" v-on="on">
							<v-icon>clear</v-icon>
						</v-btn>
					</template>
					<span>Termin löschen</span>
				</v-tooltip>
			</template>
			<template v-if="role === 0 && locked">
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon v-on="on">
							<v-icon>lock</v-icon>
						</v-btn>
					</template>
					<span>Aufstellungen gesperrt</span>
				</v-tooltip>
			</template>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<span v-on="on">
						<v-switch
							inset
							v-model="showExtraRoles"
							class="switch"
							label="Rollen Buttons"
							@change="extraRolesChanged"
						/>
					</span>
				</template>
				<span>Buttons zum Hinzufügen bzw. Entfernen von extra Rollen Ein-/Auschalten</span>
			</v-tooltip>
		</template>
		<v-tooltip bottom v-if="role > 0 && active === false">
			<template v-slot:activator="{ on }">
				<v-btn icon @click="uploadLog" class="button" v-on="on">
					<v-icon>cloud_upload</v-icon>
				</v-btn>
			</template>
			<span>Logs uploaden</span>
		</v-tooltip>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import MenuWingComp from "./MenuWingComp.vue";
	import AnmeldungComp from "./AnmeldungComp.vue";
	import ListAnmeldungComp from "./ListAnmeldungComp.vue";
	import KommentarComp from "./KommentarComp.vue";
	import { MyActions } from "@/models/Store/State";
	import { Termin } from "models/Termin";
	import { Encounter } from "models/Encounter";

	export default Vue.extend({
		name: "TerminToolbarComp",
		components: { KommentarComp, ListAnmeldungComp, AnmeldungComp, MenuWingComp },
		data: () => ({
			showExtraRoles: false,
		}),
		computed: {
			headline: function(): string {
				if (this.termin.endtime) {
					return `${this.termin.dateString} ${this.termin.time} - ${this.termin.endtime}`;
				} else {
					return `${this.termin.dateString} ${this.termin.time}`;
				}
			},
			lockIcon: function(): string {
				return this.locked ? "lock" : "lock_open";
			},
			locked: function(): boolean {
				return this.$vStore.getters.isLocked;
			},
			role: function(): number {
				return this.$vStore.getters.raidRole;
			},
			termin: function(): Termin {
				return this.$vStore.getters.termin;
			},
			active: function(): any {
				return this.$vStore.getters.isActive;
			},
		},
		methods: {
			addBoss: function(info: Encounter): void {
				this.$vStore.dispatch(MyActions.AddBoss, info);
			},
			openArchiveDialog: function(): void {
				this.$vStore.dispatch(MyActions.OpenDialog, "archive");
			},
			refresh: function(): void {
				this.$vStore.dispatch(MyActions.Refresh);
			},
			toggleLocked: async function(): Promise<void> {
				await this.$vStore.dispatch(MyActions.ToggleLocked);
			},
			openDeleteDialog: function(): void {
				this.$vStore.dispatch(MyActions.OpenDialog, "delete");
			},
			openShareDialog: function(): void {
				this.$vStore.dispatch(MyActions.OpenDialog, "share");
			},
			openErsatzDialog: function(): void {
				this.$vStore.dispatch(MyActions.OpenDialog, "ersatz");
			},
			uploadLog: function(): void {
				this.$vStore.dispatch(MyActions.ToggleUpload);
			},
			extraRolesChanged: function(): void {
				this.$emit("extraRolesChanged", this.showExtraRoles);
			},
		},
	});
</script>

<style scoped>
	.toolbar {
		font-size: 20px;
		font-weight: bold;
		padding: 0.5rem 1rem;
	}

	.anmeldung {
		margin: 1rem 0 0 0.5rem;
	}

	.button {
		margin-top: 15px;
	}

	.anmeldungen {
		width: fit-content;
		position: absolute;
		top: 6.9rem;
		right: 3%;
		z-index: 2;
	}

	.switch {
		margin-right: auto;
		margin-top: auto;
		display: inline-block;
		width: min-content;
		margin-left: 8px;
		padding: 0px;
	}
</style>
