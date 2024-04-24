import con from "../connector";
import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { element } from "models/Types";

export async function getForTermin(termin: number, signal?: AbortSignal): Promise<(Aufstellung & Encounter)[]> {
	return await con("aufstellungen", "get", { termin }, true, signal);
}

export async function deleteBoss(aufstellung: number, termin: number, signal?: AbortSignal): Promise<(Aufstellung & Encounter)[]> {
	return await con("aufstellungen", "delete", { aufstellung, termin }, true, signal);
}

export async function setSuccess(aufstellung: any, success: any, signal?: AbortSignal): Promise<any> {
	return await con("aufstellungen/success", "put", { aufstellung, success }, true, signal);
}

export async function setCM(aufstellung: any, cm: any, signal?: AbortSignal): Promise<any> {
	return await con("aufstellungen/cm", "put", { aufstellung, cm }, true, signal);
}

export async function getElements(termin: number, signal?: AbortSignal): Promise<element[]> {
	return await con("aufstellungen/elements", "get", { termin }, true, signal);
}

export async function setClass(aufstellung: any, position: any, value: any, signal?: AbortSignal): Promise<any> {
	return await setElement(aufstellung, position, value, "class", signal);
}

export async function setRole(aufstellung: any, position: any, value: any, signal?: AbortSignal): Promise<any> {
	return await setElement(aufstellung, position, value, "role", signal);
}

export async function setName(aufstellung: any, position: any, value: any, signal?: AbortSignal): Promise<any> {
	return await setElement(aufstellung, position, value, "name", signal);
}

export function setElement(aufstellung: any, position: any, value: any, type: any,signal?: AbortSignal ): Promise<any> {
	return con("aufstellungen/elements", "post", { aufstellung, position, value, type }, true, signal);
}

export function copyElements(from: any, to: any, signal?: AbortSignal): Promise<element[]> {
	return con("aufstellungen/copyElements", "post", { from, to }, true, signal);
}

export async function reloadBlanko(aufstellung: number, signal?: AbortSignal): Promise<element[]> {
	return await con("aufstellungen/reloadBlanko", "post", { aufstellung }, true, signal);
}
