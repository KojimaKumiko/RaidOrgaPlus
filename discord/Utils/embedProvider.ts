import { EmbedBuilder, GuildEmoji } from "discord.js";
// import * as _icons from "../services/icons";
import { miscIcon } from "../services/icons";
import { DiscordClient } from "../models/DiscordClient";
import { Spieler, SpielerTermin } from "models/Spieler";
import { Termin } from "models/Termin";
import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { getCalenderTermine } from "./queries";
import { Raid } from "../../models/Raid";

export function defaultEmbed(): EmbedBuilder {
	const iconUrl = miscIcon("raid");
	return new EmbedBuilder().setColor("#F55535").setTimestamp().setFooter({ text: "RaidOrga+", iconURL: iconUrl });
}

export function terminEmbed(
	client: DiscordClient,
	raidName: string,
	termin: Termin,
	aufstellungen: (Aufstellung & Encounter)[],
	anmeldungen: (Spieler & SpielerTermin)[]
): EmbedBuilder {
	const emojis = getAnmeldeEmojis(client);
	let allBosses = aufstellungen.map((a, index) => `(${index + 1}) ${a.name}${a.is_cm ? " CM" : ""}`).join("\n");
	if (allBosses === "") {
		allBosses = "Keine";
	}

	let anmeldungenString = anmeldungen
		.filter((a) => a.type < 3)
		.map((a) => `${emojis[a.type]} ${a.name}`)
		.join("\n");
	if (anmeldungenString === "") {
		anmeldungenString = "Keine";
	}

	const gesamtString = gesamtAnmeldungen(anmeldungen, emojis);

	let time = termin.time;
	if (termin.endtime) {
		time += " - " + termin.endtime;
	}

	time += " Uhr";

	return defaultEmbed()
		.setTitle(`${raidName} - Kommender Termin`)
		.addFields([
			{ name: "Datum", value: termin.dateString },
			{ name: "Uhrzeit", value: time },
			{ name: "Geplante Bosse", value: allBosses },
			{ name: "Anmeldungen", value: anmeldungenString },
			{ name: "Gesamt Anmeldungen", value: gesamtString },
		]);
}

function getAnmeldeEmojis(client: DiscordClient) {
	const emojiYes = client.emojis.cache.find((emoji) => emoji.name === "yes");
	const emojiMaybe = client.emojis.cache.find((emoji) => emoji.name === "maybe");
	const emojiNo = client.emojis.cache.find((emoji) => emoji.name === "no");
	return [emojiYes, emojiMaybe, emojiNo];
}

export async function kalenderEmbed(): Promise<EmbedBuilder> {
	const week = await getTermine();
	const embed = defaultEmbed().setTitle(`Rising Light Kalender`).setThumbnail(miscIcon("raid"));
	for (const day of week) {
		let dayString = "";
		for (const termin of day.termine) {
			dayString += terminToString(termin);
		}

		if (dayString === "") {
			dayString = "Keine Termine";
		}

		dayString = `\`\`\`${dayString}\`\`\``;
		embed.addFields([{ name: day.date, value: dayString }]);
	}
	return embed;
}

async function getTermine(): Promise<{ date: string; termine: (Termin & Raid)[] }[]> {
	const termine = await getCalenderTermine();
	termine.forEach((termin) => {
		termin.time = termin.time.slice(0, 5);
		termin.endtime = termin.endtime ? termin.endtime.slice(0, 5) : null;
	});

	const weekdays: (Termin & Raid)[][] = [];
	for (let i = 0; i < 7; i++) {
		weekdays[i] = termine.filter((t) => t.date.getDay() === i);
	}

	const today_weekday = new Date().getDay();
	const weekdays_shifted: { date: string; termine: (Termin & Raid)[] }[] = [];
	for (let i = 0; i < 7; i++) {
		const shifted_termine = weekdays[(today_weekday + i) % 7];
		const date = new Date();
		date.setDate(date.getDate() + i);
		const dateString = formatDate(date);
		weekdays_shifted[i] = { date: dateString, termine: shifted_termine };
	}

	return weekdays_shifted;
}

function formatDate(date: any) {
	let day = date.getDate();
	day = day < 10 ? `0${day}` : day;
	const month = date.getMonth();
	const months = [
		"Januar",
		"Februar",
		"März",
		"April",
		"Mai",
		"Juni",
		"Juli",
		"August",
		"September",
		"Oktober",
		"November",
		"Dezember",
	];
	const weekday = date.getDay();
	const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
	return `**${weekdays[weekday]}** - ${day}. ${months[month]}`;
}

function terminToString(termin: Termin & Raid) {
	if (termin.endtime) {
		return `${termin.time} - ${termin.endtime} | ${termin.name}\n`;
	} else {
		return `${termin.time}         | ${termin.name}\n`;
	}
}

function gesamtAnmeldungen(anmeldungen: (Spieler & SpielerTermin)[], emojis: GuildEmoji[]): string {
	let gesamtAnmeldungen = "";

	const yesCount = anmeldungen.filter((a) => a.type === 0).length;
	const maybeCount = anmeldungen.filter((a) => a.type === 1).length;
	const noCount = anmeldungen.filter((a) => a.type === 2).length;

	if (yesCount === 0 && maybeCount === 0 && noCount === 0) {
		gesamtAnmeldungen = "Keine";
	} else {
		gesamtAnmeldungen = `${yesCount} ${emojis[0]} ${maybeCount} ${emojis[1]} ${noCount} ${emojis[2]}`;
	}

	return gesamtAnmeldungen;
}
