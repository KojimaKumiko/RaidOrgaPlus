import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
	.setName("hello")
	.setDescription("Gibt eine Liste aller zur verfügung stehenden Befehle aus.");

export default {
	data: command,
	execute: (interaction: CommandInteraction<CacheType>): Promise<void> => pong(interaction),
	production: false,
	global: false
};

async function pong(interaction: CommandInteraction<CacheType>) {
	await interaction.reply("Hello World!");
}

// exports.run = (client, message, args) => {
//     message.channel.send('Hello World!');
// };
