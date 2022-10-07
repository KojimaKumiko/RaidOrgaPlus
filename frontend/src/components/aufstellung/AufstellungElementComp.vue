<template>
	<div :class="{ highlighted: isSelfUser, doubled: isNameDoubled }" style="display: flex; flex-direction: column">
		<v-menu v-if="editAllowed" class="namemenu">
			<template v-slot:activator="{ on }">
				<span
					v-on="on"
					@contextmenu.prevent="clearName"
					class="hover"
					:class="{ bold: isSelfUser }"
					style="overflow: hidden; padding-left: 5px; padding-right: 5px"
					>{{ user.name }}</span
				>
			</template>
			<MenuNameComp v-on:pick="pickName" />
		</v-menu>
		<NameComp
			v-else
			v-bind:user="user"
			:truncate="true"
			:clickable="true"
			:class="{ bold: isSelfUser }"
			style="overflow: hidden"
		/>
		<div>
			<v-menu :close-on-content-click="false" v-model="classMenuOpen" v-if="editAllowed">
				<template v-slot:activator="{ on: menu }">
					<span v-on="menu">
						<v-tooltip bottom :disabled="className == ''">
							<template v-slot:activator="{ on: tooltip }">
								<v-avatar :size="20" :tile="true" class="avatar hover" v-on="tooltip" @contextmenu.prevent="clearClass">
									<img :src="emptyIcon" v-if="classIcon === ''" />
									<img :src="classIcon" v-else />
								</v-avatar>
							</template>
							<span>{{ className }}</span>
						</v-tooltip>
					</span>
				</template>
				<MenuClassComp v-on:pick="pickClass" />
			</v-menu>
			<v-tooltip bottom v-else :disabled="className == ''">
				<template v-slot:activator="{on}">
					<v-avatar :size="20" :tile="true" class="avatar" v-on="on">
						<img :src="emptyIcon" v-if="classIcon === ''" />
						<img :src="classIcon" v-else />
					</v-avatar>
				</template>
				<span>{{ className }}</span>
			</v-tooltip>
			<span v-if="editAllowed">
				<v-menu v-for="(role, idx) in this.roles" :key="idx">
					<template v-slot:activator="{ on: menu }">
						<span v-on="menu">
							<v-tooltip bottom :disabled="role.id === 0">
								<template v-slot:activator="{ on: tooltip }">
									<v-avatar
										:size="20"
										:tile="true"
										class="avatar hover"
										v-on="tooltip"
										@contextmenu.prevent="clearRole(idx)"
									>
										<img :src="emptyIcon" v-if="role.id === 0" />
										<img :src="roleIcon(role.abbr)" v-else />
									</v-avatar>
								</template>
								<span>{{ role.name }}</span>
							</v-tooltip>
						</span>
					</template>
					<MenuRoleComp v-on:pick="pickRole(idx, $event)" :showStar="true" />
				</v-menu>
				<template v-if="showExtraRoles">
					<v-btn color="green" fab width="24px" height="24px" @click="addRole" v-if="this.roles.length < 4">
						<v-icon>add</v-icon>
					</v-btn>
					<v-btn
						color="red"
						fab
						width="24px"
						height="24px"
						style="margin-left: 4px"
						@click="removeRole"
						v-if="this.roles.length > 1"
					>
						<v-icon>remove</v-icon>
					</v-btn>
				</template>
			</span>
			<v-tooltip bottom v-else v-for="(role, idx) in this.roles" :key="idx" :disabled="role.id === 0">
				<template v-slot:activator="{ on }">
					<v-avatar :size="20" :tile="true" class="avatar" v-on="on">
						<img :src="emptyIcon" v-if="role.id === 0" />
						<img :src="roleIcon(role.abbr)" v-else />
					</v-avatar>
				</template>
				<span>{{ role.name }}</span>
			</v-tooltip>
		</div>
	</div>
</template>

<script lang="ts">
	import Vue, { PropType } from "vue";
	import _icons from "../../services/icons";
	import _aufstellungen from "../../services/endpoints/aufstellungen";
	import MenuClassComp from "./MenuClassComp.vue";
	import MenuRoleComp from "./MenuRoleComp.vue";
	import MenuNameComp from "./MenuNameComp.vue";
	import NameComp from "../menu/NameComp.vue";
	import { MyActions } from "@/models/Store/State";
	import { element } from "models/Types";
	import { Role } from "models/Rolle";
	import { CLASSES } from "../../../../models/Klasse";

	export default Vue.extend({
		name: "AufstellungElementComp",
		components: { NameComp, MenuNameComp, MenuRoleComp, MenuClassComp },
		props: {
			aufstellung: Object as PropType<any>,
			position: Number,
			showExtraRoles: Boolean,
		},
		data: () => ({
			classMenuOpen: false,
		}),
		computed: {
			editAllowed: function(): boolean {
				return (
					this.$vStore.getters.isActive &&
					(!this.$vStore.getters.isLocked || this.$vStore.getters.raidRole > 0)
				);
			},
			element: function(): element | undefined {
				return this.$vStore.getters.elementForPosition(this.aufstellung.id, this.position);
			},
			isNameDoubled: function(): boolean {
				if (!this.element || !this.element.name || this.element.id <= 1) {
					return false;
				}
				return this.$vStore.getters.isNameDoubled(this.aufstellung, this.element.name);
			},
			classIcon: function(): string {
				if (this.element && this.element.class !== "") {
					return _icons.classIcon(this.element.class);
				} else {
					return "";
				}
			},
			emptyIcon: function(): string {
				return _icons.miscIcon("empty");
			},
			user: function(): any {
				if (this.element) {
					return {
						id: this.element.id,
						name: this.element.name,
						accname: this.element.accname,
					};
				} else {
					return {
						id: 0,
						name: "???",
						accname: "???",
					};
				}
			},
			isSelfUser: function(): boolean {
				if (!this.element || !this.$vStore.getters.loggedInUser) {
					return false;
				}
				const selfAccName = this.$vStore.getters.loggedInUser.accname;
				return this.element.accname === selfAccName;
			},
			roles: function(): Role[] {
				if (this.element && this.element.roles && this.element.roles.length > 0) {
					return this.element.roles;
				}
				return [{ id: 0 }] as Role[];
			},
			className: function(): string {
				if (this.element && this.element.class != "") {
					return CLASSES.find(c => c.abbr === this.element.class).name;
				} else {
					return "";
				}
			},
		},
		methods: {
			pickClass: async function(clss: any) {
				this.classMenuOpen = false;
				await this.$vStore.dispatch(MyActions.PickClass, {
					aufstellung: this.aufstellung.id,
					position: this.position,
					clss,
				});
			},
			clearClass: async function() {
				await this.$vStore.dispatch(MyActions.ClearClass, {
					aufstellung: this.aufstellung.id,
					position: this.position,
				});
			},
			addRole: async function() {
				await this.$vStore.dispatch(MyActions.AddRole, {
					aufstellung: this.aufstellung.id,
					position: this.position,
				});
			},
			removeRole: async function() {
				await this.$vStore.dispatch(MyActions.RemoveRole, {
					aufstellung: this.aufstellung.id,
					position: this.position,
				});
			},
			pickRole: async function(idx: number, role: Role) {
				await this.$vStore.dispatch(MyActions.PickRole, {
					aufstellung: this.aufstellung.id,
					position: this.position,
					role,
					idx,
				});
			},
			clearRole: async function(idx: number) {
				await this.$vStore.dispatch(MyActions.ClearRole, {
					aufstellung: this.aufstellung.id,
					position: this.position,
					idx,
				});
			},
			pickName: async function(user: any) {
				await this.$vStore.dispatch(MyActions.PickName, {
					aufstellung: this.aufstellung.id,
					position: this.position,
					user,
				});
			},
			clearName: async function() {
				await this.$vStore.dispatch(MyActions.ClearName, {
					aufstellung: this.aufstellung.id,
					position: this.position,
				});
			},
			roleIcon: function(icon: string): string {
				if (icon !== "") {
					return _icons.roleIcon(icon);
				}
				return "";
			},
		},
	});
</script>

<style scoped lang="scss">
	.avatar {
		margin: 0 0.3rem;
	}

	.namemenu {
		margin-left: 0.2rem;
	}

	.hover {
		cursor: pointer;
	}

	.bold {
		font-weight: bold;
	}

	.highlighted {
		background-color: $menuColor;
		border-radius: 10px;
	}

	.doubled {
		border-style: solid;
		border-radius: 10px;
		border-width: 1px;
		border-color: red;
		margin: -1px;
	}
</style>
