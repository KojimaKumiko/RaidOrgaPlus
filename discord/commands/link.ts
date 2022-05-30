import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";

import { RaidRole } from "../../models/Enums";
import { Raid } from "models/Raid";
import { listRaidsForUser, removeChannelFromRaid, setChannelForRaid } from "../Utils/queries";
import { equalsIgnoreCase } from "../Utils/misc";

const command = new SlashCommandBuilder()
	.setName("link")
	.setDescription("Befehle, um einen Channel mit einem Raid zu verknüpfen/die Verknüpfung aufzuheben.")
	.addSubcommand((sub) =>
		sub.setName("list").setDescription("Listet die Raids auf, die mit dem Channel verknüpft werden können.")
	)
	.addSubcommand((sub) =>
		sub
			.setName("set")
			.setDescription("Verknüpft einen Raid mit einem Channel.")
			.addStringOption((option) => option.setName("raid").setDescription("Der Name des Raides").setRequired(true))
	)
	.addSubcommand((sub) =>
		sub
			.setName("remove")
			.setDescription("Hebt die bestehende Verknüpfung mit diesem Channel auf.")
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
	);

export default {
	data: command,
	execute: executeCommand,
	production: true,
	global: false
};

async function executeCommand(interaction: CommandInteraction<CacheType>): Promise<void> {
	const subCommand = interaction.options.getSubcommand();

	switch (subCommand) {
		case "list":
			await listRaids(interaction);
			break;
		case "set":
			await setRaid(interaction);
			break;
		case "get":
			await getRaid(interaction);
			break;
		case "remove":
			await removeRaid(interaction);
			break;
	}
}

async function listRaids(interaction: CommandInteraction<CacheType>): Promise<void> {
	await interaction.deferReply();
	const guildUser = await interaction.guild.members.fetch(interaction.user);

	const raids = await listRaidsForUser(guildUser.nickname, RaidRole.Lieutenant);
	if (raids != null && raids.length > 0) {
		const embed = new MessageEmbed()
			.setColor("#0099ff")
			.setTitle("Verknüpfbare Raids")
			.addField("Raids", raids.map((r) => r.name).join("\n"))
			.setTimestamp();

		await interaction.editReply({ embeds: [embed] });
	} else {
		await interaction.editReply("Es konnten keine Raids gefunden werden, die du verknüpfen kannst.");
	}
}

async function setRaid(interaction: CommandInteraction<CacheType>): Promise<void> {
	await interaction.deferReply();

	const guildUser = await interaction.guild.members.fetch(interaction.user);
	const raidName = interaction.options.getString("raid");

	const raids = await listRaidsForUser(guildUser.nickname, RaidRole.Lieutenant);

	if (raids == null || raids.length <= 0) {
		await interaction.editReply(
			"Du brauchst mindestens Lieutenant Rechte um einen Raid mit einem Channel zu verknüpfen."
		);
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

async function removeRaid(interaction: CommandInteraction<CacheType>): Promise<void> {
	await interaction.deferReply();

	const guildUser = await interaction.guild.members.fetch(interaction.user);
	const raids = await listRaidsForUser(guildUser.nickname, RaidRole.Lieutenant);
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

async function getRaid(interaction: CommandInteraction<CacheType>): Promise<void> {
	await interaction.deferReply();

	const guildUser = await interaction.guild.members.fetch(interaction.user);
	const raids = await listRaidsForUser(guildUser.nickname);
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

// import { DiscordClient, DiscordMessage } from "../models/DiscordClient";

// const _raids = require('../services/endpoints/raids');
// const _channels = require('../services/store/channels');

// exports.run = async (client: DiscordClient, message: DiscordMessage, args: number[]) => {
//     message.channel.startTyping();
//     const raids = await _raids.getRaids(message.auth);
//     const allowedRaids = raids.filter(r => r.role > 0);
//     if (args[0] && args[0] <= allowedRaids.length) {
//         const chosenRaid = allowedRaids[args[0] - 1];
//         _channels.setRaid(message.channel.id, chosenRaid);
//         message.channel.send(`Dieser Channel gehört nun zum Raid ${chosenRaid.name}.`);
//     } else if (allowedRaids.length > 0) {
//         let response = 'Wähle einen Raid zum Verlinken:\n';
//         for (let i = 1; i <= allowedRaids.length; i++) {
//             response += `\n\`\`\`!orga link ${i} => ${allowedRaids[i - 1].name}\`\`\``;
//         }
//         message.channel.send(response);
//     } else {
//         message.channel.send('Du hast keine Raids, die du verlinken könntest.');
//     }
//     message.channel.stopTyping();
// };

// exports.help = {
//     usage: '!orga link',
//     desc: 'Verknüpft einen Raid mit einem Discord-Channel.'
// };
