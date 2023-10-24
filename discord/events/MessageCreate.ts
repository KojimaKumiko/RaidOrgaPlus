import { ChannelType, Embed, EmbedBuilder, Message, MessageType } from "discord.js";
import { DiscordEvent } from "../models/DiscordEvent";
import { decrypt, encrypt } from "../Utils/encyrption";

export default {
	name: "messageCreate",
	once: false,
	execute: async (message: Message<boolean>): Promise<void> => {
		if (message.type !== MessageType.Reply) {
			return;
		}

		if (message.channel.type === ChannelType.GuildText && message.channel.name === "shoutbox") {
			await sendMessage(message);
		}

		if (message.channel.type === ChannelType.DM) {
			await sendReply(message);
		}
	}
} as DiscordEvent

async function sendMessage(message: Message<boolean>): Promise<void> {
	if (message.partial) {
		await message.fetch();
	}

	if (message.author.bot) {
		return;
	}

	const ref = await message.fetchReference();
	const encryptedUserId = ref.embeds[0].footer.text;
	const userId = decrypt(encryptedUserId);

	const user = await message.guild.members.fetch(userId);
	const dmChannel = await user.createDM();

	const embed = new EmbedBuilder()
		.setColor("#0099ff")
		.setTitle("RE: Nachricht")
		.setDescription(message.content)
		.addFields([{ name: "Antworten", value: "Antworte auf diese Nachricht mit Rechtsklick -> Antworten um eine weitere Nachricht ans Leitungsteam zu schicken."}])
		.setFooter({ text: ref.id })
		.setTimestamp();

	await dmChannel.send({ embeds: [embed] });
}

async function sendReply(message: Message<boolean>): Promise<void> {
	if (message.partial) {
		await message.fetch();
	}

	if (message.author.bot) {
		return;
	}

	const ref = await message.fetchReference();
	if (ref.embeds == null || ref.embeds.length <= 0) {
		return;
	}
	const messageId = ref.embeds[0].footer.text;
	const guild = await message.client.guilds.fetch(process.env.GUILD_ID);
	let channel = guild.channels.cache.find(ch => ch.name === "shoutbox");

	if (channel == null) {
		const channels = await guild.channels.fetch();
		channel = channels.find(ch => ch.name === "shoutbox");
	}

	if (channel.type === ChannelType.GuildText) {
		const orgMessage = await channel.messages.fetch(messageId);
		const userId = encrypt(message.author.id);

		// send an embed with the message of the user to the channel named "shoutbox", with the encrypted user id in the footer.
		const embed = new EmbedBuilder()
			.setColor("#0099ff")
			.setTitle("RE: Nachricht")
			.setDescription(message.content)
			.setFooter({ text: userId })
			.setTimestamp();

		await orgMessage.reply({ embeds: [embed] });
	}
}