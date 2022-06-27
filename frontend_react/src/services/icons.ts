import config from './config.json';

export function classIcon(icon: any): string {
    return linkBuilder('class', icon);
}

export function roleIcon(icon: any): string {
    return linkBuilder('role', icon);
}

export function encIcon(icon: any): string {
    return linkBuilder('encounter', icon);
}

export function miscIcon(icon: any): string {
    return linkBuilder('misc', icon);
}

export function wingIcon(icon: any): string {
    return linkBuilder('wings', icon);
}

export function linkBuilder(subfolder: string, icon: any): string {
    const environment = process.env.NODE_ENV as "development" | "production";
    return `${config[environment]}icons/${subfolder}/${icon.toString().toLowerCase()}.png`;
}