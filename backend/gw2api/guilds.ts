import apiclient from 'gw2api-client';
import apiKey from './key.json';
import * as _items from './items';

const api = apiclient();
const API_KEY = apiKey.keyRL;
const RL_ID = '7D6A1444-3C91-E911-81A8-CD1049069AE5';

export async function getUsers(): Promise<any> {
    let members = [];

	try {
		members = await api.authenticate(API_KEY).guild(RL_ID).members().get();
	} catch (e) {
		console.error(e);
	}
	
	return members;
}

export function findUser(roUser, guildUsers) {
    return guildUsers.find(g => g.name === roUser.accname);
}

export async function getGuildLog() {
    const relevantLogTypes = ['joined', 'invited', 'kick', 'rank_change', 'stash'];
	let result = [];

    try {
		const response = await api.authenticate(API_KEY).guild(RL_ID).log().get();
		result = await Promise.all(response.filter(l => relevantLogTypes.includes(l.type)).map(mapStashEntries));
	} catch (e) {
		console.error(e);
	}

	return result;
}

export function filterLogByUser(roUser, guildLog) {
    return guildLog.filter(l => l.user === roUser.accname);
}

async function mapStashEntries(entry) {
    if (entry.type === 'stash') {
        let stash_string = '';
        if (entry.item_id !== 0) {
            const item = await _items.getForId(entry.item_id);
            const item_name = item.name;
            stash_string = `${entry.count} * ${item_name}`;
            entry.type = 'item';
            entry.stashIcon = item.icon;
        } else {
            const gold = Math.floor(entry.coins / 10000);
            const silver = Math.floor(entry.coins % 10000 / 100);
            const copper = entry.coins % 100;
            if (gold) stash_string = `${gold} Gold ${silver} Silber ${copper} Kupfer`;
            else if (silver) stash_string = `${silver} Silber ${copper} Kupfer`;
            else stash_string = `${copper} Kupfer`;
            entry.type = 'coin';
        }
        if (entry.operation === 'deposit') {
            entry.stashText = `In Bank gelegt: ${stash_string}`;
        } else {
            entry.stashText = `Aus Bank genommen: ${stash_string}`;
        }
    }
    return entry;
}