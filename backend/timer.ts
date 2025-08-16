import { query } from "../database/connector";
import { getGuildMember, addRole, removeRole, removeNewMemberRole } from "./discord/users";

export function startUserCheckTimer(): void {
	const now = new Date();
	const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
	const timeout = (nextDate.getTime() - now.getTime()) + 1000 * 60;
	setTimeout(startCheckDiscordUser, timeout);
}

function startCheckDiscordUser() {
	const interval = 1000 * 60 * 60 * 24;
	setInterval(checkDiscordUsers, interval);

	checkDiscordUsers();
}

export async function checkDiscordUsers(): Promise<void> {
	try {
		const spielerList = await getSpieler();
		const raids = (await getRaids()).map(r => r.name);
		const spielerGroup = groupBy(spielerList, s => s.accname);
		const accNames = spielerGroup.keys();
		const now = new Date();
		const threshold = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60);

		for (const name of accNames) {
			const spieler = spielerGroup.get(name);
			const spielerRaids = spieler.map(s => s.name);
			const discordUser = await getGuildMember(name);

			if (discordUser != null) {
				const roles = discordUser.roles.cache.filter(r => raids.includes(r.name));

				spielerRaids.forEach(async r => {
					if (!roles.has(r)) {
						await addRole(name, r);
					}
				});

				roles.forEach(async r => {
					if (!spielerRaids.includes(r.name)) {
						await removeRole(name, r.name);
					}
				});

				const memberSince = spieler[0].memberSince;
				if (memberSince != null && memberSince < threshold) {
					await removeNewMemberRole(name);
				}
			}
		}
	} catch (error) {
		console.error('Exception during discord-user check', error);
	}
}

async function getSpieler(): Promise<{ accname: string, memberSince: Date, name: string }[]> {
	const stmt = `
		SELECT s.accname, s.memberSince, r.name
		FROM Spieler s
		LEFT JOIN Spieler_Raid sr ON s.id = sr.fk_spieler
		LEFT JOIN Raid r ON sr.fk_raid = r.id
		WHERE s.id > 9
	`;

	try {
		return await query(stmt);
	}
	catch (e) {
		throw e;
	}
}

async function getRaids(): Promise<{ name: string }[]> {
	const stmt = 'SELECT name FROM Raid';
	try {
		return await query(stmt);
	} catch (e) {
		throw e;
	}
}

function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
	const map = new Map();

	list.forEach(item => {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
			collection.push(item);
		}
	});

	return map;
}