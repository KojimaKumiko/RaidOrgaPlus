import con from '../connector';
import { playerInvite, Response, userRaid } from 'models/Types';
import { Spieler } from 'models/Spieler';
import { Raid } from 'models/Raid';

export async function listRaidsForPlayer(signal?: AbortSignal): Promise<userRaid[]> {
	return await con('raids', 'get', {}, true, signal);
}

export async function getRaidFromId(raidId: number, signal?: AbortSignal): Promise<Raid> {
	return await con("raids", "get", { raidId }, true, signal);
}

export async function getRole(raidId: any, signal?: AbortSignal): Promise<any> {
	return (await con<any>('raids/role', 'get', { raid: raidId }, true, signal)).role;
}

export async function listPlayers(raid: number, signal?: AbortSignal): Promise<Spieler[]> {
	return await con('raids/players', 'get', { raid }, true, signal);
}

export async function kickPlayer(raid: any, user: any, signal?: AbortSignal): Promise<any> {
	return await con('raids/players', 'delete', { raid, user }, true, signal);
}

export async function invitePlayer(raid: any, user: any, signal?: AbortSignal): Promise<any> {
	return await con('raids/invites', 'post', { raid, user }, true, signal);
}

export async function invitablePlayers(raid: any, signal?: AbortSignal): Promise<Spieler[]> {
	return await con('raids/invitable', 'get', { raid }, true, signal);
}

export async function pendingInvitesForPlayer(signal?: AbortSignal): Promise<playerInvite[]> {
	return await con('raids/invites', 'get', {}, true, signal);
}

export async function pendingInvitesForRaid(raid: number, signal?: AbortSignal): Promise<number[]> {
	return await con('raids/invites', 'get', { raid }, true, signal);
}

export async function acceptInvite(raid: number, signal?: AbortSignal): Promise<void> {
	return await con('raids/invites/accept', 'post', { raid }, true, signal);
}

export async function deleteInviteAsLead(raid: any, user: any, signal?: AbortSignal): Promise<any> {
	return await con('raids/invites', 'delete', { raid, user }, true, signal);
}

export async function deleteInviteAsSelf(raid: any, signal?: AbortSignal): Promise<any> {
	return await con('raids/invites', 'delete', { raid }, true, signal);
}

export async function getAnmeldungState(signal?: AbortSignal): Promise<any> {
	return await con('raids/anmeldungen', 'get', {}, true, signal);
}

export async function setLieutenantRole(raidId: number, user: number, role: number, signal?: AbortSignal): Promise<void> {
	return await con('raids/lieutenant', 'post', { raidId, user, role }, true, signal);
}

export async function generateUserToken(raidId: number, signal?: AbortSignal): Promise<{ token: string, success: boolean }> {
	return await con('raids/generateUserToken', 'post', { raidId }, true, signal);
}

export async function setUserToken(raidId: number, token: string, signal?: AbortSignal): Promise<Response> {
	return await con('raids/setUserToken', 'post', { raidId, token }, true, signal);
}

export async function getUserToken(raidId: number, signal?: AbortSignal): Promise<Response<string>> {
	return await con('raids/getUserToken', 'get', { raidId }, true, signal);
}