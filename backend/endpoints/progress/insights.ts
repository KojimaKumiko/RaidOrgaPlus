import * as user from '../users/apikey';
import * as api from '../../gw2api/account';
import items from './insightItems.json';

export async function insights(userId: number): Promise<any> {
	try {
		const sf_api = await user.api(userId);
		if (!sf_api) return 0;
		const key = sf_api[0];
		if (!key) return [];
		const itemCounts = await api.itemCount(key);

		const insights = getCountOfItemList(itemCounts, items.insights);
		const divinations = getCountOfItemList(itemCounts, items.divinations);

		let craftedInsights = 0;
		craftedInsights += getCountOfItemList(itemCounts, items.prowessInsignia) * 25;
		const perfectedArmor = getCountOfItemList(itemCounts, items.perfected);
		craftedInsights += (Math.min(perfectedArmor, 6) * 25 + Math.max(perfectedArmor - 6, 0) * 50);
		const refinedArmor = getCountOfItemList(itemCounts, items.refined);
		craftedInsights += (Math.max(Math.min(perfectedArmor, 6) + refinedArmor - 6, 0) * 25);

		const craftedDivinations = getCountOfItemList(itemCounts, items.coalescence) * 150;

		const cofferInsights = getCountOfItemList(itemCounts, items.coffers.insights);
		const cofferDivinations = getCountOfItemList(itemCounts, items.coffers.divinations);

		return [
			{
				name: 'li', hand: insights, crafted: craftedInsights, coffer: cofferInsights
			},
			{
				name: 'ld', hand: divinations, crafted: craftedDivinations, coffer: cofferDivinations
			}
		]
	} catch (e) {
		console.error(e);
		return {};
	}
}

function getCountOfItemList(allCount: any[], items: number[]) {
	return allCount.filter(e => items.includes(e.id)).map(e => e.count).reduce(add, 0);
}

function add(a, b) {
	return a + b;
}

