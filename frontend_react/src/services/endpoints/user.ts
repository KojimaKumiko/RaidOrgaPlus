import fetch from "../connector";
import { Spieler } from "../../../../models/Spieler";

export async function get(): Promise<Spieler> {
	return await fetch("users", "get", {}, true);
}

export async function login(accName: string, pwd: string): Promise<string> {
	return await fetch('users/sessions', 'post', { accName, pwd }, false)
}