<template>
	<div>
		<v-form ref="form" v-model="valid" lazy-validation class="form">
			<v-text-field
				@keypress.enter="submit"
				v-model="accName"
				:rules="accNameRules"
				label="Accountname"
				required
			/>
			<v-text-field
				@keypress.enter="submit"
				v-if="registerMode"
				v-model="name"
				:rules="nameRules"
				label="Anzeigename"
				required
				counter="10"
			/>
			<v-text-field
				@keypress.enter="submit"
				v-if="registerMode"
				v-model="email"
				:rules="emailRules"
				label="E-Mail-Adresse"
				required
			/>
			<v-text-field
				@keypress.enter="submit"
				v-model="password"
				:rules="passwordRules"
				type="password"
				label="Passwort"
				required
			/>
			<v-text-field
				@keypress.enter="submit"
				v-if="registerMode"
				:rules="passwordRepeatRules"
				type="password"
				label="Passwort wiederholen"
				required
			/>
			<v-btn @click="submit" :color="buttonColor" text>
				{{ buttonText }}
			</v-btn>
			<v-btn v-if="!registerMode" @click="passwordDialogOpen = true" text>
				Passwort vergessen?
			</v-btn>
			<v-progress-circular v-if="loading" indeterminate color="primary" />
			<v-snackbar v-model="snackbar">
				{{ failureText }}
				<v-btn color="pink" @click="snackbar = false">
					OK
				</v-btn>
			</v-snackbar>
		</v-form>
		<v-checkbox v-model="registerMode" label="Neu registrieren?" />
		<PasswordForgotDialog v-bind:open="passwordDialogOpen" v-on:close="closeDialog" />
	</div>
</template>

<script lang="ts">
	import { VForm } from "@/models/Types";
	import Vue from "vue";
	import _users from "../../services/endpoints/users";
	import _cookies from "../../services/util/cookies";
	import PasswordForgotDialog from "./PasswordForgotDialog.vue";

	export default Vue.extend({
		name: "LoginComp",
		components: { PasswordForgotDialog },
		data: () => ({
			valid: true,
			accName: "",
			accNameRules: [
				(v: string) => !!v || "Bitte gib deinen Accountnamen an",
				(v: string) => /^[a-zA-Z\s]+\.\d{4}$/.test(v) || "Bitte gib einen gültigen Accountnamen an",
			],
			name: "",
			nameRules: [
				(v: string) => !!v || "Bitte gib deinen Anzeigenamen an",
				(v: string) => v.length <= 50 || "Bitte wähle einen kürzeren Namen",
				(v: string) => !/^[\W_]+$/.test(v) || "Der Name darf nicht nur aus sonderzeichen bestehen"
			],
			password: "",
			passwordRules: [(v: string) => !!v || "Bitte gib dein Passwort an"],
			email: "",
			emailRules: [
				(v: string) => !!v || "Bitte gib eine E-Mail-Adresse an",
				(v: string) =>
					/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)+$/.test(
						v
					) || "Bitte gib eine gültige E-Mail-Adresse an",
			],
			buttonColor: "",
			snackbar: false,
			registerMode: false,
			loading: false,
			passwordDialogOpen: false,
			passwordWrong: false,
			usernameWrong: false,
		}),
		computed: {
			failureText: function(): string {
				if (this.registerMode) {
					return "Registrieren fehlgeschlagen";
				} else {
					if (this.passwordWrong) {
						return "Das Passwort ist falsch";
					} else if (this.usernameWrong) {
						return "Der Accountname ist falsch";
					} else {
						return "Anmeldedaten inkorrekt";
					}
				}
			},
			buttonText: function(): string {
				if (this.registerMode) return "Registrieren";
				else return "Anmelden";
			},
			passwordRepeatRules: function(): any {
				return [(v: string) => v === this.password || "Passwörter müssen übereinstimmen"];
			},
			form: function(): VForm {
				return this.$refs.form as VForm;
			},
		},
		methods: {
			async submit(): Promise<void> {
				if (this.form.validate()) {
					this.loading = true;
					this.usernameWrong = false;
					this.passwordWrong = false;
					if (this.registerMode) this.register();
					else this.login();
				}
			},
			async login(): Promise<void> {
				const response = await _users.login(this.accName, this.password);

				if (response === "wrongUsername") {
					this.loading = false;
					this.snackbar = true;
					this.usernameWrong = true;
				} else if (response === "wrongPassword") {
					this.loading = false;
					this.snackbar = true;
					this.passwordWrong = true;
				} else {
					this.buttonColor = "success";
					_cookies.setCookie("session", response);
					window.location.href = "/";
				}
			},
			async register(): Promise<void> {
				const success = await _users.register(this.accName, this.password, this.name, this.email);
				if (success) {
					this.registerMode = false;
					this.loading = false;
				} else {
					this.loading = false;
					this.snackbar = true;
				}
			},
			closeDialog(): void {
				this.passwordDialogOpen = false;
			},
		},
	});
</script>

<style scoped></style>
