import fetch from '../connector';

export async function getProgress(user: any): Promise<any> {
    return await fetch('progress', 'get', {user}, true);
}

export async function getInsights(user: any): Promise<any> {
    return await fetch('progress/li', 'get', {user}, true);
}

export async function getAchievements(user: any): Promise<any> {
    return await fetch('progress/achievements', 'get', {user}, true);
}
