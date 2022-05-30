import { Request } from "express";
import { OkPacket } from "mysql";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import * as _roles from "../../authentication/role";
import * as _users from "./users";
import * as _raids from "./raids";
import * as _invites from "../raids/invites";
import * as _discord from "../../discord/discord";
import * as _guild from "../../gw2api/guilds";
import { getAllExtraAccounts } from "../users/user";
import { Authentication } from "models/Auth";
import { ControllerEndpoint } from "models/ControllerEndpoint";
import { Spieler } from "models/Spieler";
import { ModRaid } from "../../../models/Raid";
import { User } from "../../../models/Types";
import { UserRole } from "../../../models/Enums";
import { toBoolean } from "../../models/Util";

dayjs.extend(duration);

const endpoints: ControllerEndpoint[] = [
	{ function: getUsers, path: "/users", method: "get", authed: true },
	{ function: getRaids, path: "/raids", method: "get", authed: true },
	{ function: createRaid, path: "/raids", method: "post", authed: true },
	{ function: deleteRaid, path: "/raids", method: "delete", authed: true },
	{ function: invitablePlayers, path: "/raids/invitable", method: "get", authed: true },
	{ function: addPlayer, path: "/raids/spieler", method: "post", authed: true },
	{ function: getPlayersForRaid, path: "/raids/spieler", method: "get", authed: true },
	{ function: setPlayerRole, path: "/raids/role", method: "put", authed: true },
	{ function: removePlayer, path: "/raids/spieler", method: "delete", authed: true },
	{ function: setComment, path: "/users/comment", method: "put", authed: true },
	{ function: updateUserRole, path: "/users/role", method: "put", authed: true },
	{ function: archiveUser, path: "/users/archive", method: "put", authed: true },
	{ function: restoreUser, path: "/users/restore", method: "put", authed: true },
];
export default endpoints;
export {
	getUsers,
	getRaids,
	createRaid,
	deleteRaid,
	invitablePlayers,
	addPlayer,
	getPlayersForRaid,
	setPlayerRole,
	removePlayer,
	setComment,
};

async function getUsers(req: Request, authentication: Authentication): Promise<User[]> {
	const start = dayjs();
	const role = _roles.getRole(authentication);
	if (role > UserRole.Raider) {
		const users = (await _users.getUsers()) as User[];
		const discordUsers = await _discord.getAllUsers();
		const guildUsers = await _guild.getUsers();
		const guildLog = await _guild.getGuildLog();
		const allExtraAccounts = await getAllExtraAccounts();
		for (const user of users) {
			const discordUser = _discord.findUser(user, discordUsers);
			const guildUser = _guild.findUser(user, guildUsers);
			const extraAccounts = allExtraAccounts.filter((e) => e.fk_spieler === user.id);

			if (discordUser) {
				user.discord = discordUser;
			} else {
				user.discord = null;
			}

			if (guildUser) {
				user.guild = guildUser;
				user.guildLog = _guild.filterLogByUser(user, guildLog);
			}

			if (extraAccounts && extraAccounts.length > 0) {
				user.extraAccounts = extraAccounts;
			}
		}
		const duration = dayjs().diff(start);
		console.log(dayjs.duration(duration).asMilliseconds());
		return users;
	}
	return [];
}

async function getRaids(req: Request, authentication: Authentication): Promise<ModRaid[]> {
	const role = _roles.getRole(authentication);
	if (role > UserRole.Raider) {
		const raids = (await _raids.getRaids()) as ModRaid[];
		const discordUsers = await _discord.getAllUsers();
		for (const raid of raids) {
			const users = await _raids.listPlayers(raid.id);
			for (const user of users) {
				const discordUser = _discord.findUser(user, discordUsers);
				if (discordUser) {
					user.discord = discordUser;
				} else {
					user.discord = null;
				}
			}
			raid.spieler = users;
		}
		return raids;
	}
	return [];
}

async function getPlayersForRaid(req: Request, authentication: Authentication): Promise<Spieler[]> {
	const raid = Number(req.query.raid);
	const role = _roles.getRole(authentication);
	if (role > UserRole.Normal && raid) {
		const discordUsers = await _discord.getAllUsers();
		const users = await _raids.listPlayers(raid);
		for (const user of users) {
			const discordUser = _discord.findUser(user, discordUsers);
			if (discordUser) {
				user.discord = discordUser;
			}
		}
		return users;
	}
	return [];
}

async function createRaid(req: Request, authentication: Authentication): Promise<OkPacket> {
	const name: string = req.body.name;
	const role = _roles.getRole(authentication);
	if (role > UserRole.Maz && name) {
		await _discord.addRaidRole(name);
		await _raids.createRaid(name);
	}
	return;
}

async function deleteRaid(req: Request, authentication: Authentication): Promise<OkPacket> {
	const raidId = Number(req.body.id);
	const raidName: string = req.body.name;
	const role = _roles.getRole(authentication);
	if (role > UserRole.Maz && raidId && raidName) {
		await _discord.removeRaidRole(raidName);
		return await _raids.deleteRaid(raidId);
	}
}

async function invitablePlayers(req: Request, authentication: Authentication): Promise<Spieler[]> {
	const raid = Number(req.query.raid);
	const role = _roles.getRole(authentication);
	if (role > UserRole.Maz && raid) {
		return await _invites.invitable(raid);
	}
	return [];
}

async function addPlayer(req: Request, authentication: Authentication): Promise<OkPacket> {
	const raidId = Number(req.body.raid);
	const spielerId = Number(req.body.spieler);
	const accName: string = req.body.accname;
	const raidName: string = req.body.raidName;
	const role = _roles.getRole(authentication);

	if (role > UserRole.Maz && raidId && spielerId) {
		await _discord.addRole(accName, raidName);

		return await _raids.addPlayer(raidId, spielerId);
	}
	return;
}

async function removePlayer(req: Request, authentication: Authentication): Promise<OkPacket> {
	const raid = Number(req.body.raid);
	const spieler = Number(req.body.spieler);
	const accName: string = req.body.accname;
	const raidName: string = req.body.raidName;
	const role = _roles.getRole(authentication);

	if (role > UserRole.Maz && raid && spieler) {
		await _discord.removeRole(accName, raidName);

		await _raids.removePlayer(raid, spieler);
	}
	return;
}

async function setPlayerRole(req: Request, authentication: Authentication): Promise<void> {
	const raidId = Number(req.body.raid);
	const spielerId = Number(req.body.spieler);
	const role_to_set = Number(req.body.role);
	const accName: string = req.body.accname;
	const role = _roles.getRole(authentication);
	if (role >= UserRole.Maz && raidId && spielerId && (role_to_set || role_to_set === 0)) {
		const raidCount = await _raids.getRaidsAsLead(spielerId);

		if (raidCount <= 1 && role_to_set == 0) {
			await _discord.removeRaidLead(accName);
		} else {
			await _discord.addRaidLead(accName);
		}

		await _raids.setPlayerRole(raidId, spielerId, role_to_set);
	}
}

async function setComment(req: Request, authentication: Authentication): Promise<void> {
	const spieler = Number(req.body.spieler);
	const comment: string = req.body.comment;
	if (spieler && comment) {
		const role = _roles.getRole(authentication);
		if (role > UserRole.Maz) await _users.setComment(spieler, comment);
	}
}

async function updateUserRole(req: Request, authentication: Authentication): Promise<void> {
	const spielerId = Number(req.body.spielerId);
	const userRole = Number(req.body.role);
	const role = _roles.getRole(authentication);

	if (userRole != null && spielerId != null && (role >= UserRole.Moderator || role > userRole)) {
		await _users.updateSpielerRole(spielerId, userRole);
	}
}

/**
 * archives a specified user.
 * @param req the request.
 * @param authentication the authentication of the user who send the request.
 * @returns the archival date or null.
 */
async function archiveUser(req: Request, authentication: Authentication): Promise<Date> {
	const userId = Number(req.body.userId);
	const role = _roles.getRole(authentication);

	if (userId != null && role >= UserRole.Moderator) {
		const archiveDate = dayjs().toDate();
		await _users.archiveUser(userId, archiveDate);

		return archiveDate;
	}
}

/**
 * restores a specified archived user.
 * @param req the request.
 * @param authentication the authentication of the user who send the request.
 */
async function restoreUser(req: Request, authentication: Authentication): Promise<void> {
	const userId = Number(req.body.userId);
	const role = _roles.getRole(authentication);

	if (userId != null && role >= UserRole.Moderator) {
		await _users.restoreUser(userId);
	}
}
