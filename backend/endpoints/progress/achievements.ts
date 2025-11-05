import * as user from '../users/apikey';
import * as api from '../../gw2api/account';

export async function achievementsDone(userId: number): Promise<any[]> {
	try {
		const sf_api = await user.api(userId);
		if (!sf_api) {
			return [];
		}

		const key = sf_api[0];
		if (!key) {
			return [];
		}

		return await api.getDoneAchievements(key);
	} catch (e) {
		console.error(e);
		return [];
	}
}

