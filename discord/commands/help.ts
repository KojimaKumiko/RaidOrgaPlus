import {
	ApplicationCommand,
	ApplicationCommandOptionType,
	CacheType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { defaultEmbed } from "../Utils/embedProvider";

const command = new SlashCommandBuilder()
	.setName("help")
	.setDescription("Gibt eine Liste aller zur verfügung stehenden Befehle aus.")
	.addStringOption((option) => option.setName("befehl").setDescription("der Name des Befehls").setRequired(false));

export default {
	data: command,
	execute: (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => help(interaction),
	production: true,
	global: true,
};

async function help(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	const commandName = interaction.options.getString("befehl");

	const client = interaction.client;
	const guild = await client.guilds.fetch(process.env.GUILD_ID);
	const guildCommands = await guild.commands.fetch();
	const guildUser = await interaction.guild.members.fetch(interaction.user);
	const userPerms = guildUser.permissions;
	let embed: EmbedBuilder;

	if (commandName != null && commandName.trim() != null && commandName.trim() != "") {
		const command = guildCommands.filter((c) => c.name === commandName).first();
		if (command == null) {
			await interaction.reply(`Der Befehl *${commandName}* konnte nicht gefunden werden.`);
			return;
		}

		embed = await commandHelp(command);
	} else {
		embed = defaultEmbed().setTitle("Help - Alle Befehle");
		guildCommands.forEach((command) => {
			const hasPerms = command.defaultMemberPermissions
				? userPerms.has(command.defaultMemberPermissions) && command.defaultMemberPermissions.bitfield > 0
				: true;

			if (hasPerms) {
				const description = command.description && command.description.trim() ? command.description : " - ";
				embed.addFields({ name: command.name, value: description });
			}
		});
	}

	await interaction.reply({ embeds: [embed] });
}

async function commandHelp(command: ApplicationCommand<any>): Promise<EmbedBuilder> {
	const desc = command.description && command.description.trim() ? command.description : " - ";
	const embed = defaultEmbed()
		.setTitle("Help - " + command.name)
		.setDescription(desc);

	command.options.forEach((option) => {
		if (option.type === ApplicationCommandOptionType.Subcommand) {
			let value = option.description;

			if (option.options != null) {
				value += "\nOptionen:";

				option.options.forEach((subOption) => {
					value += `\n${subOption.name}: ${subOption.description}`;
				});
			}

			embed.addFields({ name: option.name, value });
		}
	});

	return embed;
}
