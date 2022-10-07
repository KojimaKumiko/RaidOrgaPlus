import fs from "fs";
import consoleStamp from "console-stamp";
import { Intents, Collection, PartialTypes } from "discord.js";
import { DiscordClient } from "./models/DiscordClient";
import { Command } from "./models/Commands";
import { defaultExport } from "models/Types";

import { DiscordEvent } from "./models/DiscordEvent";
import { startCalenderTimer } from "./timer";

consoleStamp(console, {
	format: ":date(dd.mm.yyyy HH:MM:ss.l) :label",
});

const intents = [
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.DIRECT_MESSAGES,
];

const partials: PartialTypes[] = [];
if (!process.env.BACKEND) {
	partials.push("MESSAGE", "REACTION", "CHANNEL", "USER", "GUILD_MEMBER");
}

const client = new DiscordClient({
	intents: intents,
	partials: partials,
});

if (!process.env.BACKEND) {
	client.commands = new Collection();
	const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".ts"));

	commandFiles.forEach(async (file) => {
		const command: defaultExport<Command> = await import(`./commands/${file}`);
		if (command == null || command.default == null) {
			return;
		}

		if (!command.default.production && process.env.NODE_ENV === "production") {
			return;
		}

		client.commands.set(command.default.data.name, command.default);
	});

	const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".ts"));
	eventFiles.forEach(async (file) => {
		const event: defaultExport<DiscordEvent> = await import(`./events/${file}`);
		if (event.default.once) {
			client.once(event.default.name, event.default.execute);
		} else {
			client.on(event.default.name, event.default.execute);
		}
	});

	startCalenderTimer();
}

client.login(process.env.DISCORD_TOKEN);

export { client };
