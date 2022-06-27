import fetch from "../connector";
import { Spieler } from "../../../../models/Spieler";

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
	return (await fetch<string[]>('users/mail', 'post', { email, pwd }, true))[0];
}

export async function changePassword(oldPwd: string, newPwd: string): Promise<string> {
	return (await fetch<string[]>('users/pwd', 'post', { oldPwd, newPwd }, true))[0];
}