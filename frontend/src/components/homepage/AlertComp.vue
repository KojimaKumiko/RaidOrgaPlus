<template>
	<div>
		<v-alert type="error" text v-if="noDiscordFound">
			<h3>Kein Discord-Account gefunden</h3>
			<p>
				Für diesen RO+-Account konnte kein Discord-Account gefunden werden. Mögliche Gründe könnten sein:
				<ul>
					<li>Auf dem Rising-Light Discord wurde kein Nutzer gefunden, dessen Nicknamen den Account-Namen <b>{{ user.accname }}</b> beinhaltet. Stelle bitte sicher, dass dein Nickname auf dem Discord auch deinen Account-Namen enthält.</li>
					<li>Es können aufgrund von Problemen der Discord-API gerade keine Nutzer-Informationen abgefragt werden.</li>
				</ul>
			</p>
		</v-alert>
		<v-alert type="info" text v-else-if="applicationInProgress">
			<h3>Bewerbung wird bearbeitet</h3>
			<p>
				Deine Bewerbung ist angekommen und wird bearbeitet. Dies kann einige Tage dauern.<br />
				Bei Fragen oder Problemen kannst du dich jederzeit an jemanden aus dem Leitungsteam wenden.
			</p>
		</v-alert>
		<v-alert type="info" text v-else-if="noApplication">
			<h3>Keine Bewerbung</h3>
			<p>
				Für diesen Account liegt uns keine Bewerbung vor. Um dich zu bewerben, tritt dem <a href="https://join.rising-light.de">Rising-Light Discord</a> bei.
				Dort findest du im Channel #erste-schritte eine Nachricht mit einem Bewerbungs-Knopf. Klicke auf den Bewerbungs-Knopf, fülle das Formular aus und schicke dieses ab.
				Daraufhin solltest du eine Nachricht von unserem Bewerbungs-Bot erhalten. Wenn dies der Fall ist, ist deine Bewerbung erfolgreich bei uns angekommen und wird zeitnah bearbeitet.<br />
				Falls es zu Problemen kommt oder du Fragen haben solltest, kannst du dich jederzeit an jemanden aus dem Leitungsteam wenden.
			</p>
		</v-alert>
	</div>
</template>

<script lang="ts">
	import Vue, { PropType } from "vue";
	import { Spieler } from "models/Spieler";
	import { DiscordMember } from "models/Discord";

	export default Vue.extend({
		name: "AlertComp",
		props: {
			user: Object as PropType<Spieler>,
		},
		data: () => ({
			applicationInProgress: false,
			noDiscordFound: false,
			noApplication: false,
		}),
		created: function(): void {
			if (this.user == null) {
				return;
			}

			if (this.user.discord == null) {
				this.noDiscordFound = true;
				return;
			}

			if (this.user.role == 0) {
				let discord = this.user.discord as DiscordMember;
				if (discord.roles != null && discord.roles.length > 0) {
					// checking if the player has the open application role and no raider role, to determine whether or not any of the alerts should be shown.
					const hasApplicationRole = discord.roles.some(r => r.name == "offene bewerbung");
					const hasRaiderRoles = discord.roles.some(r => r.name.includes("raider"));
					this.applicationInProgress = hasApplicationRole;
					this.noApplication = !hasApplicationRole && !hasRaiderRoles;
				}
			}
		},
	});
</script>

<style scoped></style>
