<template>
	<div>
		<v-chip-group multiple column active-class="activeChip" class="suche" v-model="activeFilter">
			<v-chip filter v-for="filter in filterList" :key="filter">
				{{ filter }}
			</v-chip>
		</v-chip-group>
		<v-container>
			<v-layout row wrap>
				<v-flex xs12 sm6>
					<v-text-field
						outline
						class="suche"
						label="Suche nach Spielern"
						prepend-inner-icon="search"
						v-model="filterText"
					></v-text-field>
				</v-flex>
				<v-flex xs12 sm6>
					<v-text-field
						outline
						class="suche"
						label="Suche nach Rollen"
						prepend-inner-icon="search"
						v-model="roleText"
					></v-text-field>
				</v-flex>
			</v-layout>
		</v-container>
		<div v-if="users.length > 0" class="suche">Zeige {{ filteredUsers.length }} / {{ users.length }}</div>
		<v-expansion-panels class="list">
			<v-expansion-panel v-for="user in filteredUsers" :key="user.accname">
				<v-expansion-panel-header>
					<ModListUserHeaderComp v-bind:user="user"> </ModListUserHeaderComp>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<ModListUserBodyComp
						class="listRowBody"
						v-bind:user="user"
						@userArchived="archivedUser"
						@userRestored="restoredUser"
						@commentUpdated="commentUpdated"
					/>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import _moderation from "../../services/endpoints/moderation";
	import ModListUserHeaderComp from "./ModListUserHeaderComp.vue";
	import ModListUserBodyComp from "./ModListUserBodyComp.vue";
	import { ExtraAccount } from "models/ExtraAccount";
	import { User } from "models/Types";

	export default Vue.extend({
		name: "ModUserListComp",
		components: { ModListUserBodyComp, ModListUserHeaderComp },
		data: () => ({
			users: [] as User[],
			open: false,
			filterText: "",
			roleText: "",
			filterList: [
				"Mit Discord",
				"Ohne Discord",
				"14 Tage inaktiv",
				"1. Raid vier Wochen her",
				"Archiviert",
				"Nicht Archiviert",
			],
			activeFilter: [5] as number[],
		}),
		computed: {
			filteredUsers: function(): User[] {
				return this.users.filter(u => this.isInFilter(u));
			},
		},
		methods: {
			isInFilter: function(user: User): boolean {
				return this.isInNameFilter(user) && this.isInChipFilter(user) && this.isInRoleFilter(user);
			},
			isInChipFilter: function(user: User): boolean {
				for (const filter of this.activeFilter) {
					const filterString = this.filterList[filter];
					let currentTruth;
					switch (filterString) {
						case "Mit Discord":
							currentTruth = this.hasDiscord(user);
							break;
						case "Ohne Discord":
							currentTruth = !this.hasDiscord(user);
							break;
						case "14 Tage inaktiv":
							currentTruth = this.twoWeeksInactive(user);
							break;
						case "1. Raid vier Wochen her":
							currentTruth = this.firstRaidFourWeeks(user);
							break;
						case "Archiviert":
							currentTruth = this.isArchived(user);
							break;
						case "Nicht Archiviert":
							currentTruth = !this.isArchived(user);
							break;
					}
					if (!currentTruth) return false;
				}
				return true;
			},
			isInNameFilter: function(user: User): boolean {
				const name = user.name.toLowerCase();
				const accname = user.accname.toLowerCase();
				const searchText = this.filterText.toLowerCase();
				let inExtraAccounts = false;

				if (user.extraAccounts && user.extraAccounts.length > 0) {
					inExtraAccounts = user.extraAccounts.some(
						(e: ExtraAccount) => e.accName.toLowerCase().indexOf(searchText) > -1
					);
				}

				return name.indexOf(searchText) > -1 || accname.indexOf(searchText) > -1 || inExtraAccounts;
			},
			isInRoleFilter: function(user: User): boolean {
				if (this.roleText === "") {
					return true;
				}

				if (!user.discord) {
					return false;
				}

				const searchText = this.roleText.toLowerCase();
				return !!user.discord.roles.find((r: any) => r.name.toLowerCase().indexOf(searchText) > -1);
			},
			hasDiscord: function(user: User): boolean {
				return !!user.discord;
			},
			twoWeeksInactive: function(user: User): boolean {
				const date = Number(new Date(user.lastActive));
				const diff = Number(new Date()) - date;
				return diff > 1000 * 60 * 60 * 24 * 14;
			},
			firstRaidFourWeeks: function(user: User): boolean {
				if (!user.firstTermin) return false;
				const date = Number(new Date(user.firstTermin));
				const diff = Number(new Date()) - date;
				return diff > 1000 * 60 * 60 * 24 * 28;
			},
			isArchived: function(user: User): boolean {
				return user.archived;
			},
			archivedUser: function(userId: number, archiveDate: Date): void {
				const user = this.users.find(u => u.id === userId);
				if (user != null) {
					user.archived = true;
					user.archiveDate = archiveDate;
				}
			},
			restoredUser: function(userId: number): void {
				const user = this.users.find(u => u.id === userId);
				if (user != null) {
					user.archived = false;
					user.archiveDate = null;
				}
			},
			commentUpdated: function(userId: number, comment: string): void {
				const user = this.users.find(u => u.id === userId);
				if (user != null) {
					user.comment = comment;
				}
			}
		},
		created: async function(): Promise<void> {
			this.users = await _moderation.getUsers();
		},
	});
</script>

<style scoped>
	.listRowBody {
		margin: 0 0 1% 1%;
	}
	.suche {
		margin: 0 10px;
	}
	.activeChip {
		font-weight: bold;
		color: lightblue;
	}
	.list {
		margin-top: 10px;
	}
</style>
