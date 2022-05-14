import config from './config.json';

type environment = "development" | "production";

export function getCurrentEnvironment(): environment {
	return process.env.NODE_ENV as environment;
}

export function getURL(): string {
	return config[getCurrentEnvironment()];
}