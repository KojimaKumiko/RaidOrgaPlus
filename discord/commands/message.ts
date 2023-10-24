import {
	CacheType,
	ChannelType,
	CommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} from "discord.js";

import { encrypt } from "../Utils/encyrption";

const command = new SlashCommandBuilder()
	.setName("message")
	.setDescription("Send a message to the moderators of this Server!")
	.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
	.setDMPermission(false);

export default {
	data: command,
	execute: (interaction: CommandInteraction<CacheType>): Promise<void> => message(interaction),
	production: false,
	global: false,
};

async function message(interaction: CommandInteraction<CacheType>): Promise<void> {
	await interaction.reply({ content: "The bot has send you a message with the instructions.", ephemeral: true });

	const message = `Hello!\nWhat message do you want to send to the moderators of the server ${interaction.guild.name}?`;
	const dmChannel = await interaction.user.createDM();
	await dmChannel.send(message);

	const replyCollection = await dmChannel.awaitMessages({
		filter: null,
		max: 1,
		time: 900_000, // 900.000 ms = 15 Minutes.
	});

	const reply = replyCollection.first();
	const userId = encrypt(reply.author.id);

	const embed = new EmbedBuilder()
		.setColor("#0099ff")
		.setTitle("New Ticket (or something like this)")
		.setDescription("I could have a description?")
		.addFields({ name: "Message", value: reply.content })
		.setTimestamp()
		.setFooter({ text: userId });

	const channel = interaction.guild.channels.cache.find((channel) => channel.name === "shoutbox");
	if (channel && channel.type === ChannelType.GuildText) {
		channel.send({ embeds: [embed] });
	} else {
		interaction.followUp({ embeds: [embed] });
	}
}
