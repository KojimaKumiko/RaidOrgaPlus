import { client } from "../../discord/bot";
import { terminEmbed } from "../../discord/Utils/embedProvider";
import { getTerminData } from "../../discord/events/Reaction";
import { DiscordClient } from "../../discord/models/DiscordClient";

import { deleteDiscordTermin, getDiscordTermin } from "../endpoints/termine/anmeldungen";

import { DiscordTermin } from "../../models/Termin";
import { NrDictionary } from "../../models/Dictionary";

const terminTimeouts: NrDictionary<NodeJS.Timeout> = {};
const baseTimeoutTime = 1000 * 60;

/**
 * Updates the termin embed in Discord after roughly a minute of waiting
 * @param termin the Id of the Termin which was updated.
 */
export function updateTerminEmbed(termin: number): void {
	let timeoutTime = baseTimeoutTime;
	if (terminTimeouts[termin] != null) {
		clearTimeout(terminTimeouts[termin]);
		terminTimeouts[termin] = null;
		delete terminTimeouts[termin];
	}

	// increasing the wait time for updates if there are more than one, to spread out the calls to the Discord API and the database.
	const length = Object.keys(terminTimeouts).length;
	if (length > 0) {
		timeoutTime = timeoutTime + 5000 * length;
	}

	const timeout = setTimeout(async () => {
		const discordTermin = await getDiscordTermin(termin);
		await updateEmbed(discordTermin);
		terminTimeouts[termin] = null;
		delete terminTimeouts[termin];
	}, timeoutTime);

	terminTimeouts[termin] = timeout;
}

/**
 * Deletes the embed message in Discord and the DiscordTermin from the database.
 * @param termin the Id of the Termin that was archived/deleted.
 */
export async function deleteEmbed(termin: number): Promise<void> {
	const discordTermin = await getDiscordTermin(termin);
	if (discordTermin != null) {
		const message = await getMessage(discordTermin.channelId, discordTermin.messageId);
		if (message != null) {
			await message.delete();
		}
	}

	await deleteDiscordTermin(termin);
}

async function updateEmbed(discordTermin: DiscordTermin): Promise<void> {
	const { termin, anmeldungen, aufstellungen, raid } = await getTerminData(discordTermin.fk_termin);

	const embed = terminEmbed(client as DiscordClient, raid.name, termin, aufstellungen, anmeldungen);
	const message = await getMessage(discordTermin.channelId, discordTermin.messageId);
	if (message != null) {
		await message.edit({ embeds: [embed] });
	}
}

async function getMessage(channelId: string, messageId: string) {
	let counter = 0;
	do {
		try {
			const guild = await client.guilds.fetch(process.env.GUILD_ID);
			const channel = await guild.channels.fetch(channelId);
			if (channel.isText()) {
				return await channel.messages.fetch(messageId);
			}
			break;
		} catch (error) {
			console.error(error);
			counter++;
			await delay(5000);
		}
	}
	while (counter < 3);
}

const delay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));