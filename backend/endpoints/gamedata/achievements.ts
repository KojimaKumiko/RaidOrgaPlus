import * as api from '../../gw2api/achievements';

export async function getAchievements(): Promise<any[]> {
    return []; // temporarily disable API calls.
	return api.getAchievements();
}