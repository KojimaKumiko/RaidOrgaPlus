import * as api from '../../gw2api/achievements';

export async function getAchievements(): Promise<any[]> {
    return api.getAchievements();
}