const user = require('../users/apikey');
const api = require('../../gw2api/api');
const items = require('./insightItems');

exports.insights = insights;

async function insights(userId) {
    try {
        const sf_api = await user.api(userId);
        if (!sf_api) return 0;
        const key = sf_api[0].apikey;
        const itemCounts = await api.itemCount(key);

        let insights = getCountOfItemList(itemCounts, items.insights);
        let divinations = getCountOfItemList(itemCounts, items.divinations);

        let craftedInsights = 0;
        craftedInsights += getCountOfItemList(itemCounts, items.prowessInsignia) * 25;
        const perfectedArmor = getCountOfItemList(itemCounts, items.perfected);
        craftedInsights += (Math.min(perfectedArmor, 6) * 25 + Math.max(perfectedArmor - 6, 0) * 50);
        const refinedArmor = getCountOfItemList(itemCounts, items.refined);
        craftedInsights += (Math.max(Math.min(perfectedArmor, 6) + refinedArmor - 6, 0) * 25);

        return [
            {
                name: 'li', hand: insights, crafted: craftedInsights
            },
            {
                name: 'ld', hand: divinations, crafted: 0
            }

        ]
    } catch (e) {
        console.log(e);
        return {};
    }
}

function getCountOfItemList(allCount, items) {
    return allCount.filter(e => items.includes(e.id)).map(e => e.count).reduce(add, 0);
}

function add(a,b) {
    return a+b;
}
