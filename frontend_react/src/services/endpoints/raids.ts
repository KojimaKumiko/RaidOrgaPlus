import con from '../connector';
import { playerInvite, Response, userRaid } from 'models/Types';
import { Spieler } from 'models/Spieler';
import { Raid } from 'models/Raid';

export async function listRaidsForPlayer(): Promise<userRaid[]> {
	return await con('raids', 'get', {}, true);
}

export async function getRaidFromId(raidId: number): Promise<Raid> {
	return await con("raids", "get", { raidId }, true);
}

export async function role(raid: any): Promise<any> {
	return (await con<any>('raids/role', 'get', { raid: raid }, true)).role;
}

export async function listPlayers(raid: number): Promise<Spieler[]> {
	return await con('raids/players', 'get', { raid }, true);
}

export async function kickPlayer(raid: any, user: any): Promise<any> {
	return await con('raids/players', 'delete', { raid, user }, true);
}

export async function invitePlayer(raid: any, user: any): Promise<any> {
	return await con('raids/invites', 'post', { raid, user }, true);
}

export async function invitablePlayers(raid: any): Promise<Spieler[]> {
	return await con('raids/invitable', 'get', { raid }, true);
}

export async function pendingInvitesForPlayer(): Promise<playerInvite[]> {
	return await con('raids/invites', 'get', {}, true);
}

export async function pendingInvitesForRaid(raid: number): Promise<number[]> {
	return await con('raids/invites', 'get', { raid }, true);
}

export async function acceptInvite(raid: number): Promise<void> {
	return await con('raids/invites/accept', 'post', { raid }, true);
}

export async function deleteInviteAsLead(raid: any, user: any): Promise<any> {
	return await con('raids/invites', 'delete', { raid, user }, true);
}

export async function deleteInviteAsSelf(raid: any): Promise<any> {
	return await con('raids/invites', 'delete', { raid }, true);
}

export async function getAnmeldungState(): Promise<any> {
	return await con('raids/anmeldungen', 'get', {}, true);
}

export async function setLieutenantRole(raidId: number, user: number, role: number): Promise<void> {
	return await con('raids/lieutenant', 'post', { raidId, user, role }, true);
}

export async function generateUserToken(raidId: number): Promise<{ token: string, success: boolean }> {
	return await con('raids/generateUserToken', 'post', { raidId }, true);
}

export async function setUserToken(raidId: number, token: string): Promise<Response> {
	return await con('raids/setUserToken', 'post', { raidId, token }, true);
}

export async function getUserToken(raidId: number): Promise<Response<string>> {
	return await con('raids/getUserToken', 'get', { raidId }, true);
}