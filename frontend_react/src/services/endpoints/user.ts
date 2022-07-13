import fetch from "../connector";

import { Spieler } from "models/Spieler";
import { Build } from "models/Build";
import { ExtraAccount } from "models/ExtraAccount";
import { Theme } from "models/Enums";

export async function get(): Promise<Spieler> {
	return await fetch("users", "get", {}, true);
}

export async function login(accName: string, pwd: string): Promise<string> {
	return await fetch("users/sessions", "post", { accName, pwd }, false);
}

export async function setApiKey(apiKey: string): Promise<string> {
	return await fetch("users/api", "post", { apiKey }, true);
}

export async function changeEmail(email: string, pwd: string): Promise<string> {
	return (await fetch<string[]>("users/mail", "post", { email, pwd }, true))[0];
}

export async function changePassword(oldPwd: string, newPwd: string): Promise<string> {
	return (await fetch<string[]>("users/pwd", "post", { oldPwd, newPwd }, true))[0];
}

export async function getWithID(id: number | string): Promise<Spieler> {
	return await fetch("users", "get", { id }, true);
}

export async function hasApi(): Promise<boolean> {
	return await fetch("users/api", "get", {}, true);
}

export async function changeName(name: string): Promise<void> {
	return await fetch("users/name", "post", { name }, true);
}

export async function register(accName: string, pwd: string, name: string, email: string): Promise<boolean> {
	return await fetch("users", "post", { accName, pwd, name, email }, false);
}

export async function invalidateSession(): Promise<void> {
	return await fetch("users/sessions", "delete", {}, true);
}

export async function getBuilds(user: number): Promise<Build[]> {
	return await fetch("users/builds", "get", { user }, true);
}

export async function addBuild(clss: number, role: string): Promise<void> {
	return await fetch("users/builds", "post", { clss, role }, true);
}

export async function deleteBuild(clss: number, role: string): Promise<void> {
	return await fetch("users/builds", "delete", { clss, role }, true);
}

export async function putPrefer(clss: number, role: string, pref: number): Promise<void> {
	return await fetch("users/builds/prefer", "put", { clss, role, pref }, true);
}

export async function createResetToken(accname: string): Promise<string[]> {
	return await fetch("users/pwdReset/create", "post", { accname }, false);
}

export async function resetPassword(token: string, pwd: string): Promise<string[]> {
	return await fetch("users/pwdReset", "post", { token, pwd }, false);
}

export async function getDiscordKey(): Promise<string[]> {
	return await fetch("users/discordKey", "get", {}, true);
}

export async function hasProgressShared(user: number | string | null): Promise<boolean> {
	return await fetch("users/shared", "get", { user }, true);
}

export async function setProgressShared(shared: boolean): Promise<void> {
	return await fetch("users/shared", "put", { shared }, true);
}

export async function getExtraAccounts(): Promise<ExtraAccount[]> {
	return await fetch("users/extraAccount", "get", {}, true);
}

export async function addExtraAccount(accName: string): Promise<{ id: number }> {
	return await fetch("users/extraAccount", "put", { accName }, true);
}

export async function deleteExtraAccount(accId: number): Promise<unknown> {
	return await fetch("users/extraAccount", "delete", { accId }, true);
}

export async function updateTheme(theme: Theme): Promise<void> {
	return await fetch("users/theme", "put", { theme }, true);
}