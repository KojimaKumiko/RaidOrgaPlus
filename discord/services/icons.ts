import config from "./config.json";

export function classIcon(icon) {
    return linkBuilder('class', icon);
}

export function roleIcon(icon) {
    return linkBuilder('role', icon);
}

export function encIcon(icon) {
    return linkBuilder('encounter', icon);
}

export function miscIcon(icon) {
    return linkBuilder('misc', icon);
}

export function linkBuilder(subfolder, icon) {
    return `${config[process.env.NODE_ENV]}icons/${subfolder}/${icon.toLowerCase()}.png`;
}
