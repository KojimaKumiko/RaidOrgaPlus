import * as _session from './session';
import * as _user from './user';
import * as _discord from '../../discord/users';
import pw from 'generate-password';
import { v4 } from 'uuid';
import { query, queryV } from "../../../database/connector";
import { OkPacket } from 'mysql';
import { DiscordKey } from 'models/DiscordKey';

export {
	loginDiscord as login, deleteDiscordKeyForUser as delete, createDiscordKey as create
};

async function loginDiscord(key: string, discordId: any, agent: string): Promise<string> {
    await deleteInvalidKeys();
    const response = await getUserByDiscordKey(key);
    await deleteDiscordKey(key);
    const user = response[0];
    if (user) {
        const discordUser = await _discord.getUser(discordId);
        const discordName = discordUser.nickname.toUpperCase();
        const userId = user.fk_spieler;
        const userObject = (await _user.get(userId))[0];
        if (discordName.includes(userObject.accname.toUpperCase())) {
            const uuid = v4();
            await _session.startDiscord(userId, uuid, agent);
            await saveDiscordId(userId, discordId);
            return uuid;
        }
    }
}

async function createDiscordKey(user: number): Promise<string[]> {
    const randomKey = pw.generate({length: 10, numbers: true});
    const stmt = 'INSERT INTO DiscordKey (discord_key, fk_spieler) VALUES (?, ?)';
    try {
        await queryV(stmt, [randomKey, user]);
        return [randomKey];
    } catch(e) {
        throw e;
    }
}

async function getUserByDiscordKey(key: string): Promise<DiscordKey[]> {
    const stmt = 'SELECT * FROM DiscordKey WHERE discord_key = ? AND created > NOW() - INTERVAL 1 HOUR';
    try {
        return await queryV(stmt, key);
    } catch(e) {
        throw e;
    }
}

async function deleteDiscordKey(key: string): Promise<OkPacket> {
    const stmt = 'DELETE FROM DiscordKey WHERE discord_key = ?';
    try {
        return await queryV(stmt, key);
    } catch(e) {
        throw e;
    }
}

async function deleteDiscordKeyForUser(user: number): Promise<OkPacket> {
    const stmt = 'DELETE FROM DiscordKey WHERE fk_spieler = ?';
    try {
        return await queryV(stmt, user);
    } catch(e) {
        throw e;
    }
}

async function deleteInvalidKeys(): Promise<OkPacket> {
    const stmt = 'DELETE FROM DiscordKey WHERE created < NOW() - INTERVAL 1 HOUR';
    try {
        return await query(stmt);
    } catch(e) {
        throw e;
    }
}

async function saveDiscordId(user: number, id: number): Promise<OkPacket> {
    const stmt = 'UPDATE Spieler SET discord = ? WHERE id = ?';
    try {
        return await queryV(stmt, [id, user]);
    } catch(e) {
        throw e;
    }
}