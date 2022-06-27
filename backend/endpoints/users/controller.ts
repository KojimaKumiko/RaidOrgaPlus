import * as _login from "./login";
import * as _register from "./register";
import * as _session from "./session";
import * as _user from "./user";
import * as _api from "./apikey";
import * as _builds from "./builds";
import * as _reset from "./passwordreset";
import * as _auth from "../../authentication/auth";
import * as _roles from "../../authentication/role";
import * as _discord from "./discord";
import * as _discordUsers from "../../discord/users";
import hash from "password-hash";
import { Request } from "express";
import { Authentication } from "models/Auth";
import { Spieler } from "models/Spieler";
import { OkPacket } from "mysql";
import { ControllerEndpoint } from "models/ControllerEndpoint";
import { toBoolean } from "../../models/Util";
import { Build } from "models/Build";
import { UserRole } from "../../../models/Enums";

const endpoints: ControllerEndpoint[] = [
	{ function: getUser, path: "", method: "get", authed: true },
	{ function: invalidateSession, path: "/sessions", method: "delete", authed: true },
	{ function: registerUser, path: "", method: "post", authed: false },
	{ function: loginUser, path: "/sessions", method: "post", authed: false },
	{ function: setApi, path: "/api", method: "post", authed: true },
	{ function: hasApi, path: "/api", method: "get", authed: true },
	{ function: setName, path: "/name", method: "post", authed: true },
	{ function: setEmail, path: "/mail", method: "post", authed: true },
	{ function: setPassword, path: "/pwd", method: "post", authed: true },
	{ function: getBuilds, path: "/builds", method: "get", authed: true },
	{ function: addBuild, path: "/builds", method: "post", authed: true },
	{ function: deleteBuild, path: "/builds", method: "delete", authed: true },
	{ function: putPrefer, path: "/builds/prefer", method: "put", authed: true },
	{ function: resetPassword, path: "/pwdReset", method: "post", authed: false },
	{ function: createResetToken, path: "/pwdReset/create", method: "post", authed: false },
	{ function: getDiscordKey, path: "/discordKey", method: "get", authed: true },
	{ function: hasProgressShared, path: "/shared", method: "get", authed: true },
	{ function: setProgressShared, path: "/shared", method: "put", authed: true },
	{ function: getExtraAccounts, path: "/extraAccount", method: "get", authed: true },
	{ function: addExtraAccount, path: "/extraAccount", method: "put", authed: true },
	{ function: deleteExtraAccount, path: "/extraAccount", method: "delete", authed: true },
	{ function: getUserByName, path: "/byName", method: "get", authed: true },
	{ function: updateTheme, path: "/theme", method: "put", authed: true },
];
export default endpoints;
export {
	getUser,
	invalidateSession,
	registerUser,
	loginUser,
	setApi,
	hasApi,
	setName,
	getBuilds,
	addBuild,
	deleteBuild,
	putPrefer,
	setEmail,
	setPassword,
	createResetToken,
	resetPassword,
	getDiscordKey,
	hasProgressShared,
	setProgressShared,
	getExtraAccounts,
	addExtraAccount,
	deleteExtraAccount,
	getUserByName,
	updateTheme,
};

async function getUser(req: Request, authentication: Authentication): Promise<Spieler> {
	const id = Number(req.query.id);
	let user: Spieler = null;
	if (id) {
		const role = _roles.getRole(authentication);
		if (role != null) {
			user = (await _user.get(id))[0];
		}
	} else {
		user = (await _user.get(authentication.user))[0];
	}

	if (user) {
		const discordUsers = await _discordUsers.getAllUsers();
		const discordUser = _discordUsers.findUser(user, discordUsers);
		if (discordUser) {
			user.discord = discordUser;
		} else {
			user.discord = null;
		}
		return user;
	}
	
	return null;
}

async function invalidateSession(req: Request, authentication: Authentication): Promise<OkPacket> {
	_auth.deleteCache(authentication.uuid);
	return await _session.invalidate(authentication.uuid);
}

async function registerUser(req: Request): Promise<boolean> {
	const accName = req.body.accName;
	const pwd = req.body.pwd;
	const name = req.body.name;
	const email = req.body.email;
	if (accName && pwd && name && email) {
		return await _register.register(accName, pwd, name, email);
	}
}

async function loginUser(req: Request): Promise<string> {
	const accName = req.body.accName;
	const pwd = req.body.pwd;
	const key = req.body.key;
	const discordId = req.body.id;
	const user_agent = req.header("user-agent");
	if (accName && pwd) {
		return await _login.login(accName, pwd, user_agent);
	} else if (key && discordId) {
		return await _discord.login(key, discordId, user_agent);
	} else {
		return;
	}
}

async function setApi(req: Request, authentication: Authentication): Promise<string | boolean> {
	const apiKey = req.body.apiKey;
	if (apiKey) {
		return await _api.setApi(authentication.user, apiKey);
	} else {
		return false;
	}
}

async function hasApi(req: Request, authentication: Authentication): Promise<boolean> {
	return await _api.hasApi(authentication.user);
}

async function setName(req: Request, authentication: Authentication): Promise<OkPacket> {
	const name = req.body.name;
	if (name) {
		await _user.changeName(authentication.user, name);
	}
	return;
}

async function getBuilds(req: Request): Promise<Build[]> {
	const user = Number(req.query.user);
	if (user) {
		return await _builds.getBuilds(user);
	}
	return [];
}

async function addBuild(req: Request, authentication: Authentication): Promise<OkPacket> {
	const clss = Number(req.body.clss);
	const role = req.body.role as string;
	if (clss && role) {
		return _builds.addBuild(authentication.user, clss, role);
	} else {
		return;
	}
}

async function deleteBuild(req: Request, authentication: Authentication): Promise<OkPacket> {
	const clss = Number(req.body.clss);
	const role = req.body.role as string;
	if (clss && role) {
		return _builds.deleteBuild(authentication.user, clss, role);
	} else {
		return;
	}
}

async function putPrefer(req: Request, authentication: Authentication): Promise<OkPacket> {
	const clss = Number(req.body.clss);
	const role = req.body.role as string;
	const pref = Number(req.body.pref);
	if (authentication && clss && role) {
		return await _builds.putPrefer(authentication.user, clss, role, pref);
	} else {
		return;
	}
}

async function setEmail(req: Request, authentication: Authentication): Promise<string> {
	const pwd = req.body.pwd;
	const email = req.body.email;
	if (email) {
		const correctPwd = (await _user.getAllForId(authentication.user))[0].password;
		const isCorrect = hash.verify(pwd, correctPwd);
		if (isCorrect) {
			await _user.changeEmail(authentication.user, email);
			return "Success";
		}
	}
	return;
}

async function setPassword(req: Request, authentication: Authentication): Promise<string> {
	const oldPwd = req.body.oldPwd;
	const newPwd = req.body.newPwd;
	if (oldPwd && newPwd) {
		const correctPwd = (await _user.getAllForId(authentication.user))[0].password;
		const isCorrect = hash.verify(oldPwd, correctPwd);
		if (isCorrect) {
			await _user.changePassword(authentication.user, newPwd);
			return "Success";
		}
	}
	return;
}

async function createResetToken(req: Request): Promise<string[]> {
	const accname = req.body.accname;
	if (accname) {
		await _reset.createResetToken(accname);
		return ["Success"];
	}
	return [];
}

async function resetPassword(req: Request): Promise<string[]> {
	await _reset.deleteInvalidTokens();
	const token = req.body.token;
	const pwd = req.body.pwd;
	if (token && pwd) {
		const tokenExists = (await _reset.tokenCreated(token))[0];
		if (!tokenExists) return [];
		const tokenCreated = tokenExists.created;
		const tokenAge = Date.now() - tokenCreated.getTime();
		const tokenAgeAllowed = 1000 * 60 * 60 * 24;
		if (tokenAge < tokenAgeAllowed) {
			await _reset.resetPassword(token, pwd);
			await _reset.deleteToken(token);
			return ["Success"];
		}
	}
	return [];
}

async function getDiscordKey(req: Request, authentication: Authentication): Promise<string[]> {
	await _discord.delete(authentication.user);
	return await _discord.create(authentication.user);
}

async function hasProgressShared(req: Request, authentication: Authentication): Promise<boolean> {
	const user = Number(req.query.user);
	let response: boolean[] = null;
	if (user) {
		response = await _user.hasProgressShared(user);
	} else {
		response = await _user.hasProgressShared(authentication.user);
	}
	if (response.length > 0) {
		const sharedValue = response[0];
		return sharedValue;
	}
	return false;
}

async function setProgressShared(req: Request, authentication: Authentication): Promise<OkPacket> {
	const shared = toBoolean(req.body.shared);
	if (shared != null) {
		return await _user.setProgressShared(authentication.user, shared);
	}
	return;
}

async function getExtraAccounts(req: Request, authentication: Authentication): Promise<unknown> {
	return await _user.getExtraAccounts(authentication.user);
}

async function addExtraAccount(req: Request, authentication: Authentication): Promise<{ id: number }> {
	const accName: string = req.body.accName;
	return await _user.addExtraAccount(authentication.user, accName);
}

async function deleteExtraAccount(req: Request, authentication: Authentication): Promise<OkPacket> {
	const id = Number(req.body.accId);
	if (id > 0) {
		return await _user.deleteExtraAccount(id, authentication.user);
	} else {
		return;
	}
}

async function getUserByName(
	req: Request,
	authentication: Authentication
): Promise<{ id: number; accname: string; name: string; accName: string }[]> {
	const accName = req.query.accName as string;
	const role = _roles.getRole(authentication);
	const isRaidLead = authentication.raids.some((r) => r.role > 0);
	if (role > UserRole.Raider || isRaidLead) {
		return await _user.getUserByName(accName);
	}
	return [];
}

async function updateTheme(req: Request, authentication: Authentication): Promise<OkPacket> {
	const theme = Number(req.body.theme);
	return await _user.updateTheme(theme, authentication.user);
}
