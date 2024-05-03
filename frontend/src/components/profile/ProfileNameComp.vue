<template>
	<div>
		<div class="display-1" v-if="!edit">
			{{ name }} ({{ user.accname }})
			<v-btn icon v-if="ownProfile" @click="startEditing">
				<v-icon>edit</v-icon>
			</v-btn>
		</div>
		<v-form ref="form" lazy-validation class="form" v-if="edit">
			<v-text-field
				@keypress.enter="submit"
				v-model="name"
				:rules="nameRules"
				label="Anzeigename"
				required
				counter="50"
				solo
			></v-text-field>
			<v-btn @click="submit">
				Speichern
			</v-btn>
		</v-form>
	</div>
</template>

<script lang="ts">
	import { MyActions } from "@/models/Store/State";
	import { VForm } from "@/models/Types";
	import Vue from "vue";

	export default Vue.extend({
		name: "ProfileNameComp",
		props: ["user", "ownProfile"],
		data: () => ({
			name: null,
			edit: false,
			nameRules: [
				(v: string) => !!v || "Bitte gib einen Namen an",
				(v: string) => v.length <= 50 || "Bitte wähle einen kürzeren Namen",
				(v: string) => !/^[\W_]+$/.test(v) || "Der Name darf nicht nur aus sonderzeichen bestehen"
			]
		}),
		computed: {
			form: function(): VForm {
				return this.$refs.form as VForm;
			}
		},
		methods: {
			startEditing: function(): void {
				this.edit = true;
			},
			submit: async function(): Promise<void> {
				if (this.form.validate()) {
					await this.$vStore.dispatch(MyActions.ChangeUserName, this.name);
					this.edit = false;
				}
			}
		},
		created: function(): void {
			this.name = this.user.name;
		}
	});
</script>

<style scoped>
</style>