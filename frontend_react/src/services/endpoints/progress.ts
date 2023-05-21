import fetch from '../connector';

export async function getProgress(user: any, signal?: AbortSignal): Promise<any> {
    return await fetch('progress', 'get', {user}, true, signal);
}

export async function getInsights(user: any, signal?: AbortSignal): Promise<any> {
    return await fetch('progress/li', 'get', {user}, true, signal);
}

export async function getAchievements(user: any, signal?: AbortSignal): Promise<any> {
    return await fetch('progress/achievements', 'get', {user}, true, signal);
}
