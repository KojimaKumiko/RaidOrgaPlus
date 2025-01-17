import { ChannelType, EmbedBuilder, Message, MessageReaction, PartialMessageReaction, User } from "discord.js";
import {
	getAnmeldungenForTermin,
	getAufstellungen,
	getPlayer,
	getRaidFromId,
	getTerminFromId,
	getTerminFromMessage,
	updateAnmeldung,
} from "../Utils/queries";
import { DiscordEvent } from "../models/DiscordEvent";
import { encrypt } from "../Utils/encyrption";
import { terminEmbed } from "../Utils/embedProvider";
import { DiscordClient } from "../models/DiscordClient";
import { Termin } from "../../models/Termin";
import { Spieler, SpielerTermin } from "../../models/Spieler";
import { Aufstellung } from "../../models/Aufstellung";
import { Encounter } from "../../models/Encounter";
import { Raid } from "../../models/Raid";

export default {
	name: "messageReactionAdd",
	once: false,
	execute: async (reaction: MessageReaction | PartialMessageReaction): Promise<void> => {
		if (reaction.partial) {
			await reaction.fetch();
		}

		// get the user and make sure it's not a bot reaction to the message.
		const users = await reaction.users.fetch();
		const user = users.find((u) => !u.bot);

		if (user == null) {
			return;
		}

		const channel = reaction.message.channel;
		if (!(channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement)) {
			return;
		}

		if (reaction.emoji.name === "🎫" && channel.name === "shoutbox-bot") {
			await reaction.users.remove(user);
			await sendTicket(reaction, user);
			return;
		}

		if (reaction.emoji.name === "☃" && channel.id === process.env.GIVEAWAY_REACTION_CHANNEL) {
			await reaction.users.remove(user);
			await handleGiveawayReaction(reaction, user);
			return;
		}

		const anmeldungEmojis = ["yes", "maybe", "no"];
		if (anmeldungEmojis.includes(reaction.emoji.name)) {
			await reaction.users.remove(user);
			await handleAnmeldung(reaction, user);
			return;
		}
	},
} as DiscordEvent;

export async function getTerminData(terminId: number): Promise<{
	termin: Termin;
	anmeldungen: (Spieler & SpielerTermin)[];
	aufstellungen: (Aufstellung & Encounter)[];
	raid: Raid;
}> {
	const termin = await getTerminFromId(terminId);
	const anmeldungen = await getAnmeldungenForTermin(termin.id);
	const aufstellungen = await getAufstellungen(termin.id);
	const raid = await getRaidFromId(termin.fk_raid);

	return { termin, anmeldungen, aufstellungen, raid };
}

async function handleGiveawayReaction(reaction: MessageReaction | PartialMessageReaction, user: User) {
	const message = `Hallo! Danke für deine Hilfe bei der Suche nach den gestohlenen Geschenken!

Bitte schicke in dieser Direkt-Nachricht das Bild von dem Ort, an dem die Geschenke vergraben sind, und nenne dabei die nächstgelegene Wegmarke (in einer Nachricht)!
	
Viel Glück!`;

	// create a DM Channel with the user and send the message
	const dmChannel = await user.createDM();
	await dmChannel.send(message);

	let reply: Message<boolean> = null;

	do {
		if (reply != null) {
			if (reply.attachments.size > 1) {
				await dmChannel.send("Deine Einsendung wurde noch nicht abgeschickt, da nur ein Bild pro einsendung unterstützt. Bitte versuche es erneut und gib neben der Wegmarke nur ein Bild an.");
			}
			if (reply.attachments.size <= 0) {
				await dmChannel.send("Deine Einsendung wurde noch nicht abgeschickt, da auch das Bild benötigt wird. Bitte versuche es erneut und gib mit der Wegmarke auch das Bild an.");
			}
			if (reply.content == null || reply.content.trim() === "") {
				await dmChannel.send("Deine Einsendung wurde noch nicht abgeschickt, da auch die Wegmarke benötigt wird. Bitte versuche es erneut und gib mit dem Bild auch die Wegmarke mit an.");
			}
		}

		reply = null;

		// await a reply from the user and encrypt the user id.
		const replyCollection = await dmChannel.awaitMessages({
			filter: (m) => !m.author.bot,
			max: 1,
			time: 300_000, // 300.000 ms = 5 Minutes.
		});

		reply = replyCollection.first();
	} while (reply != null && ((reply.attachments.size <= 0 || reply.attachments.size > 1) || (reply.content == null || reply.content === "")));

	if (reply == null) {
		await dmChannel.send("Der Bot erwatet keine Nachricht mehr, da die Zeit abgelaufen ist.");
		return;
	}

	// send an embed with the image the user provided
	const image = reply.attachments.first();
	let msg = reply.content;
	if (msg == null || msg.trim() === "") {
		msg = "-";
	}
	const embed = new EmbedBuilder()
		.setColor("#0099ff")
		.setTitle("Einsendung")
		.setDescription(`<@${user.id}>`)
		.addFields({ name: "Text einsendung", value: msg })
		.setImage(image.proxyURL);

	const guild = reaction.message.guild;
	const channel = guild.channels.cache.find((channel) => channel.id === process.env.GIVEAWAY_CHANNEL);
	if (channel && channel.type === ChannelType.GuildText) {
		await channel.send({ embeds: [embed] });
		await dmChannel.send("Die Einsendung wurde dem Leitungsteam erfolgreich zugeschickt!");
	} else {
		await dmChannel.send(
			"Es gab ein Problem bei der Zustellung der Einsendung. Bitte probiere es später noch einmal."
		);
	}
}

async function sendTicket(reaction: MessageReaction | PartialMessageReaction, user: User) {
	const message = "Hallo!\nWas möchtest du dem Leitungsteam mitteilen?";

	// create a DM Channel with the user and send the message
	const dmChannel = await user.createDM();
	await dmChannel.send(message);

	let reply: Message<boolean> = null;

	do {
		// incase the user sends a sticker, reply with an error message and tell them to retry again without using stickers.
		if (reply != null) {
			await dmChannel.send("Sticker werden nicht untersützt. Bitte schicke eine Nachricht *ohne* sticker.");
		}

		reply = null;

		// await a reply from the user and encrypt the user id.
		const replyCollection = await dmChannel.awaitMessages({
			filter: (m) => !m.author.bot,
			max: 1,
			time: 900_000, // 900.000 ms = 15 Minutes.
		});

		reply = replyCollection.first();
	} while (reply != null && reply.stickers.size > 0);

	if (reply == null) {
		await dmChannel.send("Der Bot erwatet keine Nachricht mehr, da die Zeit abgelaufen ist.");
		return;
	}

	const userId = encrypt(reply.author.id);

	// send an embed with the message of the user to the channel named "shoutbox", with the encrypted user id in the footer.
	const embed = new EmbedBuilder()
		.setColor("#0099ff")
		.setTitle("Ticket")
		.setDescription(reply.content)
		// .addField("Message", reply.content)
		.setFooter({ text: userId })
		.setTimestamp();

	const guild = reaction.message.guild;
	const channel = guild.channels.cache.find((channel) => channel.name === "shoutbox");
	if (channel && channel.type === ChannelType.GuildText) {
		await channel.send({ embeds: [embed] });
		await dmChannel.send("Die Nachricht wurde dem Leitungsteam erfolgreich zugeschickt!");
	} else {
		await dmChannel.send(
			"Es gab ein Problem bei der Zustellung der Nachricht. Bitte probiere es später noch einmal."
		);
	}
}

async function handleAnmeldung(reaction: MessageReaction | PartialMessageReaction, user: User) {
	// get the guildMember to access the nickname
	const guildMember = await reaction.message.guild.members.fetch(user);

	if (guildMember == null) {
		return;
	}

	// lookup the player in the database with the nickname
	const player = await getPlayer(guildMember.nickname);

	// erorr message in case no player was found.
	if (player == null) {
		const errorMessage = await reaction.message.channel.send({
			content: `Mit dem Nicknamen **${guildMember.nickname}** konnte kein RO+ Account gefunden werden.`,
		});
		setTimeout(async () => await errorMessage.delete(), 30000);
		return;
	}

	const type = getAnmeldungType(reaction.emoji.name);
	const discordTermin = await getTerminFromMessage(reaction.message.id);

	if (discordTermin == null) {
		const errorMessage = await reaction.message.channel.send({
			content: `Der Termin konnte nicht gefunden werden. Falls dieser aktuell sein sollte, muss der embed im Discord mit dem Befehl '/termin show' neu gepostet werden.`,
		});
		setTimeout(async () => await errorMessage.delete(), 60000);
		return;
	}

	await updateAnmeldung(player.id, discordTermin.fk_termin, type);
	const { termin, anmeldungen, aufstellungen, raid } = await getTerminData(discordTermin.fk_termin);

	const embed = terminEmbed(reaction.client as DiscordClient, raid.name, termin, aufstellungen, anmeldungen);
	await reaction.message.edit({ embeds: [embed] });

	const typeText = ["angemeldet", "vielleicht da", "abgemeldet"];
	const reply = await reaction.message.channel.send(`${user} Du bist nun ${typeText[type]} ${reaction.emoji}`);
	setTimeout(async () => await reply.delete(), 10000);
}

function getAnmeldungType(emoji: string) {
	switch (emoji) {
		case "yes":
			return 0;
		case "maybe":
			return 1;
		case "no":
			return 2;
		default:
			return null;
	}
}
