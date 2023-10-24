import { CacheType, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { listRaidsForMod, removeChannelFromRaid, setChannelForRaid } from "../Utils/queries";
import { defaultEmbed } from "../Utils/embedProvider";
import { Raid } from "../../models/Raid";
import { equalsIgnoreCase } from "../Utils/misc";

const command = new SlashCommandBuilder()
	.setName("moderation")
	.setDescription("Befehle für das Leitungsteam")
	// .setDefaultPermission(false)
	.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
	.setDMPermission(false)
	.addSubcommand((sub) =>
		sub.setName("shoutbox").setDescription("Generiert eine Nachricht mit Reaction für die Shoutbox.")
	)
	.addSubcommandGroup((group) =>
		group
			.setName("link")
			.setDescription("Befehle zum verbinden von Raids und Discord Channels")
			.addSubcommand((sub) => sub.setName("list").setDescription("Listet alle Raids auf"))
			.addSubcommand((sub) =>
				sub
					.setName("set")
					.setDescription("Verknüpft den angegebenen Raid mit dem Channel")
					.addStringOption((option) =>
						option
							.setName("raid")
							.setDescription("Der Raid der mit dem Channel verknüpft werden soll.")
							.setRequired(true)
					)
			)
			.addSubcommand((sub) =>
				sub
					.setName("remove")
					.setDescription("Hebt die bestehende Verknüpfung des Raids mit diesem Channel auf.")
					.addStringOption((option) =>
						option.setName("raid").setDescription("Der Name des Raides").setRequired(false)
					)
			)
			.addSubcommand((sub) =>
				sub
					.setName("get")
					.setDescription("Gibt den namen des Verknüpften Raids zurück.")
					.addStringOption((option) =>
						option.setName("raid").setDescription("Der Name des Raides").setRequired(false)
					)
			)
	);

export default {
	data: command,
	execute: executeCommand,
	production: true,
	global: false
};

async function executeCommand(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	const subCommand = interaction.options.getSubcommand();
	const subCommandGroup = interaction.options.getSubcommandGroup(false);
	console.log(`group: ${subCommandGroup}; command: ${subCommand}`);

	if (subCommandGroup != null) {
		switch (subCommandGroup) {
			case "link":
				switch (subCommand) {
					case "list":
						await listRaids(interaction);
						break;
					case "set":
						await setRaid(interaction);
						break;
					case "remove":
						await removeRaid(interaction);
						break;
					case "get":
						await getRaid(interaction);
						break;
				}
				break;
		}

		return;
	}

	switch (subCommand) {
		case "shoutbox":
			await sendShoutboxMessage(interaction);
			break;
	}
}

async function sendShoutboxMessage(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	const embedMessage =
		"Mit der Shoutbox ist es euch möglich, dem Leitungsteam eine anonyme Nachricht zukommen zu lassen. " +
		"Dafür müsst ihr lediglich mit dem 🎫-Emote auf diese Nachricht reagieren und der Bot schreibt euch an. " +
		"Dem Bot schreibt ihr dann dass, was ihr dem Leitungsteam mitteilen möchtet. Anschließend erhaltet ihr eine Benachrichtigung darüber, das alles geklappt hat.\n\n" +
		"Das besondere an der Shoutbox ist aber, dass das Leitungsteam die Möglichkeit hat, auf eure Mitteilungen zu Antworten. " +
		"Ihr erhaltet in solchen Fällen dann vom Bot wieder eine Nachricht, mit der Antwort des Leitungsteam. " +
		"Ihr habt dann ebenfalls die Möglichkeit, auf diese Nachricht zu antworten, was eine anonyme Kommunikation zwischen dem Leitungsteam und euch ermöglicht.";
	const embed = defaultEmbed().setTitle("Die Shoutbox").setDescription(embedMessage);
	const message = await interaction.channel.send({ embeds: [embed] });

	await message.react("🎫");

	await interaction.reply({ content: "Nachricht generiert.", ephemeral: true });
}

async function listRaids(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	await interaction.deferReply();

	const raids = await listRaidsForMod();

	if (raids != null) {
		const embed = defaultEmbed()
			.setTitle("Verknüpfbare Raids")
			.addFields({ name: "Raids", value: raids.map((r) => r.name).join("\n") });

		await interaction.editReply({ embeds: [embed] });
	} else {
		await interaction.editReply("Es wurden keine Raids gefunden. Bitte probiere es später noch einmal.");
	}
}

async function setRaid(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	await interaction.deferReply();

	const raidName = interaction.options.getString("raid");

	const raids = await listRaidsForMod();

	if (raids == null || raids.length <= 0) {
		await interaction.editReply("Es wurden keine Raids gefunden. Bitte probiere es später noch einmal.");
		return;
	}

	const raid = raids.find((r) => equalsIgnoreCase(r.name, raidName));

	if (raid == null) {
		await interaction.editReply(`Der Raid mit dem Namen \`${raidName}\` konnte nicht gefunden werden.`);
		return;
	}

	await setChannelForRaid(raid.id, interaction.channelId);
	await interaction.editReply("Der Channel wurde erfolgreich mit dem Raid verknüpft.");
}

async function removeRaid(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	await interaction.deferReply();

	const raids = await listRaidsForMod();
	const raidName = interaction.options.getString("raid");

	if (raids == null || raids.length == 0) {
		await interaction.editReply(
			"Du brauchst mindestens Lieutenent Rechte um die Verknüpfung von einem Raid und einem Channel aufzuheben."
		);
		return;
	}

	let raid: Raid = null;

	if (raidName == null || raidName.trim() == "") {
		raid = raids.find((r) => r.discordChannel === interaction.channelId);
	} else {
		raid = raids.find((r) => equalsIgnoreCase(r.name, raidName));
	}

	if (raid == null) {
		await interaction.editReply("Es wurde kein Raid gefunden, der mit diesem Channel verknüpft ist.");
		return;
	}

	await removeChannelFromRaid(raid.name);
	await interaction.editReply("Der Verknüpfung mit dem Channel wurde aufgehoben.");
}

async function getRaid(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	await interaction.deferReply();

	const raids = await listRaidsForMod();
	const raidName = interaction.options.getString("raid");

	let raid: Raid = null;

	if (raidName == null || raidName.trim() == "") {
		raid = raids.find((r) => r.discordChannel === interaction.channelId);
	} else {
		raid = raids.find((r) => equalsIgnoreCase(r.name, raidName));
	}

	if (raid == null) {
		await interaction.editReply("Es konnte kein Raid gefunden werden.");
		return;
	}

	if (raid.discordChannel == null) {
		await interaction.editReply("Der Raid wurde noch mit keinem Channel verknüpft.");
		return;
	}

	const channel = await interaction.guild.channels.fetch(raid.discordChannel);

	if (channel == null) {
		await interaction.editReply(
			"Der Channel mit dem der Raid verknüpft wurde, konnte nicht gefunden werden. Bitte probiere es später noch einmal."
		);
		return;
	}

	await interaction.editReply(`Raid: ${raid.name}\tChannel: ${channel.name}`);
}
