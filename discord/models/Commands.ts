import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
	data: SlashCommandBuilder,
	execute: (interaction: CommandInteraction<CacheType>) => Promise<void>,
	production: boolean,
	global: boolean,
}