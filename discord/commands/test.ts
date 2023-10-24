import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { decrypt } from "../Utils/encyrption";

const command = new SlashCommandBuilder()
	.setName("test")
	.setDescription("A set of test commands")
	.setDefaultMemberPermissions(0)
	.setDMPermission(false)
	.addSubcommand((sub) => sub.setName("ping").setDescription("Replies with pong!"))
	.addSubcommand((sub) =>
		sub
			.setName("decrypt")
			.setDescription("Decrypts a given cypher!")
			.addStringOption((option) =>
				option.setName("cypher").setDescription("The cypher/text to decrypt.").setRequired(true)
			)
	)
	.addSubcommand((sub) => sub.setName("reaction").setDescription("Test reaction event handling"))
	.addSubcommand((sub) =>
		sub
			.setName("echo")
			.setDescription("Echoes the input")
			.addNumberOption((option) => option.setName("number").setDescription("useless option").setRequired(true))
			.addStringOption((option) => option.setName("input").setDescription("The input to echo"))
	);

export default {
	data: command,
	execute: executeCommand,
	production: false,
	global: false,
};

async function executeCommand(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	const subCommand = interaction.options.getSubcommand();

	switch (subCommand) {
		case "ping":
			await pong(interaction);
			break;
		case "decrypt":
			await decryptMessage(interaction);
			break;
		case "reaction":
			await reaction(interaction);
			break;
		case "echo":
			await echoMessage(interaction);
			break;
	}
}

async function pong(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	await interaction.reply("Pong!");
}

async function decryptMessage(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	// const cypher = interaction.options.getString("cypher");
	const cypher = interaction.options.get("cypher");
	let result = "";

	if (cypher) {
		result = decrypt(cypher.value.toString());
	}

	await interaction.reply("The result: " + result);
}

async function reaction(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	const message = await interaction.reply({ content: "Test Reaction", fetchReply: true });

	if ("react" in message) {
		await message.react("🎫");
	}
}

async function echoMessage(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
	const input = interaction.options.getString("input");

	if (input) {
		await interaction.reply("Echo: " + input);
	} else {
		await interaction.reply("Nothing to echo.");
	}
}
