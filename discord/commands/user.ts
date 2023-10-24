import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder().setName("user").setDescription("Replies with user info!");

export default {
	data: command,
	execute: (interaction: CommandInteraction<CacheType>): Promise<void> => user(interaction),
	production: false,
	global: false
};

async function user(interaction: CommandInteraction<CacheType>) {
	const member = await interaction.guild.members.fetch(interaction.user);
	await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}\nYour nickname: ${member.nickname}`);
}
