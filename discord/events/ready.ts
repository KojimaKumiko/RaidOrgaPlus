import { Client } from "discord.js";
import { DiscordEvent } from "../models/DiscordEvent";

export default {
	name: "ready",
	once: true,
	execute: async (client: Client<true>): Promise<void> => {
		console.log("Ready!");
		client.user.setActivity("/help für alle Befehle | RO+ v. 2.4.1");
	},
} as DiscordEvent;
