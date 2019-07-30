const apiclient = require('gw2api-client');
const apiKey = require('./key.json');
const _items = require('./items');

const api = apiclient();
const API_KEY = apiKey.keyRL;
const RL_ID = '7D6A1444-3C91-E911-81A8-CD1049069AE5';

exports.getUsers = getUsers;
exports.findUser = findUser;
exports.getGuildLog = getGuildLog;
exports.filterByUser = filterByUser;

async function getUsers() {
    return await api.authenticate(API_KEY).guild(RL_ID).members().get();
}

function findUser(roUser, guildUsers) {
    return guildUsers.find(g => g.name === roUser.accname);
}

async function getGuildLog() {
    const relevantLogTypes = ['joined', 'invited', 'kick', 'rank_change', 'stash'];
    const response = await api.authenticate(API_KEY).guild(RL_ID).log().get();
    return await Promise.all(response.filter(l => relevantLogTypes.includes(l.type)).map(mapStashEntries));
}

function filterByUser(roUser, guildLog) {
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