import { CacheType, Interaction } from "discord.js";
import { DiscordClient } from "../models/DiscordClient";
import { DiscordEvent } from "../models/DiscordEvent";

export default {
	name: "interactionCreate",
	once: false,
	execute: async (interaction: Interaction<CacheType>): Promise<void> => {
		if ((!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) || interaction.user.bot) {
			return;
		}

		const client = interaction.client as DiscordClient;
		const command = client.commands.get(interaction.commandName);

		if (!command) {
			return;
		}

		console.log(`Executing Command: ${interaction.commandName}`);

		try {
			await command.execute(interaction);
		} catch (e) {
			console.error(`Command: ${interaction.commandName}\nError: ${e}`);
			if (e.errors) {
				console.error(e.errors);
			}
			const errorMessage = "Es gab einen Fehler beim ausführen des Befehls. Bitte versuch den Befehl später erneut auszuführen. Falls das Problem weiterhin bestehen bleiben sollte, melde dich bei Koji";
			if (interaction.deferred) {
				await interaction.editReply({ content: errorMessage });
			} else {
				await interaction.reply({ content: errorMessage, ephemeral: true });
			}
		}
	},
} as DiscordEvent;
