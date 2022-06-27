import * as _session from '../endpoints/users/session';
import * as _raids from '../endpoints/raids/raids';
import * as _activity from '../endpoints/users/activity';
import { Authentication } from 'models/Auth';

import { Dictionary } from '../../models/Dictionary';

export {
	authenticate as auth, deleteFromCache as deleteCache
};

const CACHE_FOR = 1000 * 60;
const _cache: Dictionary<Authentication> = {};

async function authenticate(uuid: string, agent: string): Promise<Authentication> {
    if (!uuid) return;

    const cached = searchCache(uuid, agent);
    if (cached) return cached;

    return await addCache(uuid, agent);
}

function searchCache(uuid: string, agent: string): Authentication {
    const cached = _cache[uuid];
    if (!cached || cached.cachedUntil < Date.now()) return null;
    // if (cached.agent !== agent) return null;
    return cached;
}

async function addCache(uuid: string, agent: string): Promise<Authentication> {
    await _session.invalidateExpired();
    const response = (await _session.getUser(uuid))[0];
    if (!response) return;
    // if (response.agent !== agent) return;

    const authObject: Authentication = { user: response.user, role: response.role, uuid, agent, raids: [], cachedUntil: undefined };
    const raids = await _raids.listForPlayer(authObject.user);

    raids.forEach(r => {
        authObject.raids.push({id: r.id, role: r.role});
    });

    authObject.cachedUntil = Date.now() + CACHE_FOR;
    _cache[uuid] = authObject;
    await _activity.updateLastActivity(response.user);
    return authObject;
}

function deleteFromCache(uuid: string): void {
    _cache[uuid] = null;
}