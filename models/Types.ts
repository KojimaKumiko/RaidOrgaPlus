import { DiscordMember } from "./Discord";
import { ExtraAccount } from "./ExtraAccount";
import { Raid } from "./Raid";
import { Role } from "./Rolle";
import { Spieler, SpielerRaid, SpielerTermin } from "./Spieler";
import { Termin } from "./Termin";
import { Wing } from "./Wing";

export type element = {
	aufstellung: number;
	pos: number;
	class: string;
	roleIds: string;
	roles: Role[];
	id: number;
	name: string;
	accname: string;
};

export type blankoElement = {
	pos: number;
	class: string;
	roleIds: string;
	roles: Role[];
	enc: number;
};

export type playerInvite = {
	id: number;
	name: string;
}

export type terminState = {
	raid: number;
	type: number;
}

export type raidInvite = {
	spieler: number;
}

export type SpielerType = Omit<Spieler, 'discord'> & {
	discord: string;
};

export type User = Omit<Spieler, 'discord'> & {
	firstTermin: Date;
	lastTermin: Date;
	guild: any;
	guildLog: any;
	extraAccounts: ExtraAccount[];
	discord: DiscordMember;
};

export type terminDate = Pick<Termin, "date" | "dateString" | "time" | "endtime">;

export type homepageTermin = Termin & Omit<Raid, 'id'> & SpielerRaid & SpielerTermin & {
	raidID: number;
};

export type userRaid = Omit<Raid, 'active'> & {
	role: number;
};

export type Response<T = any> = {
	success: boolean;
	data?: T;
	error?: string;
}

export type defaultExport<T> = {
	default: T;
}

export type wingStrike = Wing & {
	isStrike: boolean;
}