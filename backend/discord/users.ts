import { Collection, GuildMember, Role } from "discord.js";
import { AVATAR_BASE_URL } from "./discord";
import { client } from "../../discord/bot";
import config from "./config.json";
import { Spieler } from "models/Spieler";
import { DiscordMember, DiscordRole } from "models/Discord";
import { equalsIgnoreCase } from "../util/misc";

interface IMemberCache {
	members: Collection<string, GuildMember>,
	cachedUntil: number
}

const CACHE_FOR = 1000 * 60;
const memberCache: IMemberCache = { members: null, cachedUntil: 0 };

export async function getUser(id: string): Promise<DiscordMember> {
	return (await getAllUsers()).find((m) => m.id === id);
}

export async function getAllUsers(): Promise<DiscordMember[]> {
	try {
		const members = await getAllGuildMembers();
		if (members == null) {
			return [];
		}

		return members.filter((m) => m.user.bot === false).map(mapMember);
	} catch (e) {
		console.log(e);
		return [];
	}
}

async function getAllGuildMembers() {
	try {
		const guild = getGuild();
		let members = memberCache.members;
		if (members == null || members.size < 0 || memberCache.cachedUntil < Date.now()) {
			members = await guild.members.fetch();
			memberCache.members = members;
			memberCache.cachedUntil = Date.now() + CACHE_FOR;
		}
		return members;
	} catch (e) {
		console.log(e);
		return null;
	}
}

function mapMember(member: GuildMember): DiscordMember {
	return {
		id: member.user.id,
		username: `${member.user.username}#${member.user.discriminator}`,
		nickname: getNickname(member),
		roles: getRoles(member),
		joined: member.joinedTimestamp,
		avatar: getAvatarURL(member),
		color: member.displayHexColor,
	};
}

function getNickname(member: GuildMember): string {
	if (member.nickname === null) {
		return member.user.username;
	} else {
		return member.nickname;
	}
}

function getRoles(member: GuildMember): DiscordRole[] {
	return member.roles.cache
		.filter((r) => r.id !== config.server)
		.map((r) => {
			return { id: r.id, name: r.name, color: parseColor(r.color) };
		});
}

function parseColor(number: number): string {
	return `#${number.toString(16).padStart(6, "0")}`;
}

function getAvatarURL(member: GuildMember): string {
	if (member.user.avatar === null) {
		return null;
	} else {
		return `${AVATAR_BASE_URL}/${member.user.id}/${member.user.avatar}`;
	}
}

export function findUser(roUser: Spieler, discordUsers: DiscordMember[]): DiscordMember {
	return discordUsers.find((d) => {
		return d.nickname.includes(roUser.accname);
	});
}

export async function addRole(accName: string, raidName: string): Promise<void> {
	const user = await getGuildMember(accName);
	const role = await getRole(raidName);

	if (user && role) {
		await user.roles.add(role);
	}
}

export async function removeRole(accName: string, raidName: string): Promise<void> {
	const user = await getGuildMember(accName);
	const role = await getRole(raidName);

	if (user && role) {
		await user.roles.remove(role);
	}
}

export async function addRaidLead(accName: string): Promise<void> {
	const user = await getGuildMember(accName);
	const role = await getRole(config.raidLeadRole);

	if (user && role) {
		await user.roles.add(role);
	}
}

export async function removeRaidLead(accName: string): Promise<void> {
	const user = await getGuildMember(accName);
	const role = await getRole(config.raidLeadRole);

	if (user && role) {
		await user.roles.remove(role);
	}
}

export async function removeNewMemberRole(accName: string): Promise<void> {
	const user = await getGuildMember(accName);

	if (user) {
		await user.roles.remove(config.newMemberRole);
	}
}

function getGuild() {
	return client.guilds.cache.get(config.server);
}

export async function getGuildMember(accName: string): Promise<GuildMember> {
	const members = await getAllGuildMembers();
	return members.find((m) => m.displayName.toLocaleUpperCase().includes(accName.toLocaleUpperCase()));
}

export async function getRole(roleName: string): Promise<Role> {
	const guild = getGuild();

	let role = guild.roles.cache.find((r) => equalsIgnoreCase(r.name, roleName));
	if (!role) {
		await guild.roles.fetch();
		role = guild.roles.cache.find((r) => equalsIgnoreCase(r.name, roleName));
	}

	return role;
}
