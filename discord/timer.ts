import { ChannelType } from "discord.js";
import { kalenderEmbed } from "./Utils/embedProvider";
import { client } from "./bot";

export function startCalenderTimer(): void {
	const now = new Date();
	const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 6, 0, 0, 0);
	const timeout = nextDay.getTime() - now.getTime();
	setTimeout(calenderTimer, timeout);
}

function calenderTimer(): void {
	const interval = 1000 * 60 * 60 * 12;
	setInterval(updateCalender, interval);

	updateCalender();
}

export async function updateCalender() {
	const guild = await client.guilds.fetch(process.env.GUILD_ID);
	const channel = await guild.channels.fetch(process.env.CALENDER_CHANNEL_ID);
	if (channel.type === ChannelType.GuildText) {
		const messages = await channel.messages.fetch();
		const message = messages.last();
		const embed = await kalenderEmbed();
		await message.edit({ embeds: [embed] });
	}
}