import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, GuildEmoji, MessageEmbed } from "discord.js";
import {
	getAnmeldungenForTermin,
	getAufstellungen,
	getAufstellungForTermin,
	getElementsForAufstellung,
	getTermine,
	listRaidsForUser,
	saveTermin,
} from "../Utils/queries";
import { Raid } from "../../models/Raid";
import { SpielerRaid, SpielerTermin } from "../../models/Spieler";
import { defaultEmbed, terminEmbed } from "../Utils/embedProvider";
import { DiscordClient } from "models/DiscordClient";
import { Termin } from "../../models/Termin";
import { encIcon } from "../services/icons";
import { Aufstellung } from "../../models/Aufstellung";
import { Encounter } from "../../models/Encounter";
import { equalsIgnoreCase } from "../Utils/misc";

const command = new SlashCommandBuilder()
	.setName("termine")
	.setDescription("Zeigt die Termine und Aufstellungen des Raides an.")
	.addSubcommand((sub) =>
		sub
			.setName("show")
			.setDescription("Zeigt einen oder alle Termine an.")
			.addNumberOption((option) =>
				option
					.setName("termin")
					.setDescription("Der Index des Termins der angezeigt werden soll.")
					.setRequired(false)
			)
			.addStringOption((option) =>
				option
					.setName("raid")
					.setDescription("Der Name des Raides für den der Termin angezeigt werden soll.")
					.setRequired(false)
			)
	)
	.addSubcommand((sub) =>
		sub
			.setName("aufstellung")
			.setDescription("Zeigt die Aufstellung für einen Termin an.")
			.addNumberOption((option) =>
				option
					.setName("termin")
					.setDescription("Der Index des Termins für den die Aufstellung angezeigt werden soll.")
					.setRequired(true)
			)
			.addNumberOption((option) =>
				option
					.setName("boss")
					.setDescription("Der Index des Bosses für den die Aufstellung angezeigt werden soll.")
					.setRequired(false)
			)
			.addStringOption((option) =>
				option
					.setName("raid")
					.setDescription("Der Name des Raides für den die Aufstellung angezeigt werden soll.")
					.setRequired(false)
			)
	);

export default {
	data: command,
	execute: executeCommand,
	production: true,
	global: false,
};

async function executeCommand(interaction: CommandInteraction<CacheType>): Promise<void> {
	const subCommand = interaction.options.getSubcommand();

	switch (subCommand) {
		case "show":
			await showTerminCommand(interaction);
			break;
		case "aufstellung":
			await aufstellung(interaction);
			break;
	}
}

async function showTerminCommand(interaction: CommandInteraction<CacheType>): Promise<void> {
	await interaction.deferReply();

	const terminIdx = interaction.options.getNumber("termin");
	const raidName = interaction.options.getString("raid");

	const raid = await getRaid(interaction, raidName);

	if (raid == null) {
		await interaction.editReply("Es konnte kein Raid gefunden werden.");
		return;
	}

	const termine = await getTermine(raid.fk_spieler, raid.id);

	if (terminIdx == null || terminIdx <= 0 || terminIdx > termine.length) {
		await listTermine(interaction, termine, raid);
		return;
	} else {
		await showTermin(interaction, termine[terminIdx - 1], raid.name);
		return;
	}
}

async function listTermine(
	interaction: CommandInteraction<CacheType>,
	termine: (Termin & SpielerTermin)[],
	raid: Raid & SpielerRaid
): Promise<void> {
	let embed: MessageEmbed = defaultEmbed();
	embed = embed.setTitle(`${raid.name} - Alle Termine`);

	termine.forEach((termin, idx) => {
		let value = `${termin.time}`;

		if (termin.endtime != null) {
			value += ` - ${termin.endtime}`;
		}

		embed = embed.addField(`(${idx + 1}) ${termin.dateString}`, value);
	});

	await interaction.editReply({ embeds: [embed] });
}

async function showTermin(
	interaction: CommandInteraction<CacheType>,
	termin: Termin & SpielerTermin,
	raidName: string
): Promise<void> {
	const anmeldungen = await getAnmeldungenForTermin(termin.id);
	const aufstellungen = await getAufstellungen(termin.id);

	const embed = terminEmbed(interaction.client as DiscordClient, raidName, termin, aufstellungen, anmeldungen);

	const emojiYes = interaction.client.emojis.cache.find((emoji) => emoji.name === "yes");
	const emojiMaybe = interaction.client.emojis.cache.find((emoji) => emoji.name === "maybe");
	const emojiNo = interaction.client.emojis.cache.find((emoji) => emoji.name === "no");

	await interaction.editReply({ embeds: [embed] });
	const message = await interaction.fetchReply();
	if ("react" in message) {
		await message.react(emojiYes);
		await message.react(emojiMaybe);
		await message.react(emojiNo);
	}

	await saveTermin(message.id, interaction.channelId, termin.id);
}

async function aufstellung(interaction: CommandInteraction<CacheType>) {
	await interaction.deferReply();

	const terminIdx = interaction.options.getNumber("termin");
	const bossIdx = interaction.options.getNumber("boss", false);
	const raidName = interaction.options.getString("raid", false);

	const raid = await getRaid(interaction, raidName);

	if (raid == null) {
		await interaction.editReply("Es konnte kein Raid gefunden werden.");
		return;
	}

	const aufstellungen = await getAufstellungForTermin(raid.id, terminIdx - 1);
	if (bossIdx != null && bossIdx > 0) {
		const embed = await createAufstellungEmbed(interaction.client, aufstellungen[bossIdx - 1], raid);

		await interaction.editReply({ embeds: [embed] });
	} else {
		const embedList: MessageEmbed[] = [];

		for (let i = 0; i < aufstellungen.length; i++) {
			const embed = await createAufstellungEmbed(interaction.client, aufstellungen[i], raid);
			embedList.push(embed);
		}

		while (embedList.length > 10) {
			const embeds = embedList.splice(0, 10);
			await interaction.channel.send({ embeds: embeds });
		}

		if (embedList.length > 0) {
			await interaction.channel.send({ embeds: embedList });
		}

		await interaction.editReply({ content: "Embeds mit den Aufstellungen erzeugt!" });
	}
}

async function getRaid(interaction: CommandInteraction<CacheType>, raidName: string) {
	const guildUser = await interaction.guild.members.fetch(interaction.user);
	const raids = await listRaidsForUser(guildUser.nickname);

	let raid: Raid & SpielerRaid = null;

	if (raidName == null || raidName.trim() == "") {
		raid = raids.find((r) => r.discordChannel === interaction.channelId);
	} else {
		raid = raids.find((r) => equalsIgnoreCase(r.name, raidName));
	}

	return raid;
}

async function createAufstellungEmbed(
	client: Client<boolean>,
	aufstellung: Aufstellung & Encounter,
	raid: Raid
): Promise<MessageEmbed> {
	const elements = await getElementsForAufstellung(aufstellung.id);

	let aufstellungString = "";
	const empty = client.emojis.cache.find((emoji) => emoji.name === "empty");

	const maxRole = Math.max(...elements.map((e) => e.roles.length));

	elements.forEach((element) => {
		const clss = client.emojis.cache.find((emoji) => emoji.name === element.class.toLowerCase());
		aufstellungString += `${clss ? clss : empty} `;

		element.roles.forEach((role) => {
			const emoji = client.emojis.cache.find((emoji) => emoji.name === role.abbr.toLowerCase() + "_");
			aufstellungString += `${emoji ? emoji : empty} `;
		});

		for (let i = element.roles.length; i < maxRole; i++) {
			aufstellungString += "\u1CBC\u1CBC\u1CBC";
		}

		aufstellungString += `- ${element.name}\n`;
	});

	if (aufstellungString.trim() === "") {
		aufstellungString = "Es gibt noch keine Aufstellung";
	}

	const embed = defaultEmbed()
		.setTitle(raid.name + " - Aufstellung")
		.addField("Datum", "Datum")
		.addField("Uhrzeit", "Uhrzeit")
		.addField("Boss", aufstellung.name)
		.addField("Aufstellung", aufstellungString)
		.setThumbnail(encIcon(aufstellung.abbr));

	return embed;
}
