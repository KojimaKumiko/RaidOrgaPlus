import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
	.setName("server")
	.setDescription("Replies with server info!")
	.setDMPermission(false);

export default {
	data: command,
	execute: (interaction: CommandInteraction<CacheType>): Promise<void> => server(interaction),
	production: false,
	global: false,
};

async function server(interaction: CommandInteraction<CacheType>) {
	await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
}
