export interface Class {
	id: number;
	name: string;
	abbr: string;
	color: string;
	isBase: boolean;
	fk_base: number;
}

export const CLASSES: Class[] = [
	// Base
	{ id: 1, name: "Elementalist", abbr: "Ele", color: "", isBase: true, fk_base: 1 },
	{ id: 2, name: "Mesmer", abbr: "Mes", color: "", isBase: true, fk_base: 2 },
	{ id: 3, name: "Necromancer", abbr: "Nec", color: "", isBase: true, fk_base: 3 },
	{ id: 4, name: "Ranger", abbr: "Rgr", color: "", isBase: true, fk_base: 4 },
	{ id: 5, name: "Engineer", abbr: "Eng", color: "", isBase: true, fk_base: 5 },
	{ id: 6, name: "Thief", abbr: "Thf", color: "", isBase: true, fk_base: 6 },
	{ id: 7, name: "Warrior", abbr: "War", color: "", isBase: true, fk_base: 7 },
	{ id: 8, name: "Guardian", abbr: "Gdn", color: "", isBase: true, fk_base: 8 },
	{ id: 9, name: "Revenant", abbr: "Rev", color: "", isBase: true, fk_base: 9 },
	// Heart of Thorns
	{ id: 10, name: "Tempest", abbr: "Tmp", color: "", isBase: false, fk_base: 1 },
	{ id: 11, name: "Chronomancer", abbr: "Chr", color: "", isBase: false, fk_base: 2 },
	{ id: 12, name: "Reaper", abbr: "Rea", color: "", isBase: false, fk_base: 3 },
	{ id: 13, name: "Druid", abbr: "Dru", color: "", isBase: false, fk_base: 4 },
	{ id: 14, name: "Scrapper", abbr: "Scr", color: "", isBase: false, fk_base: 5 },
	{ id: 15, name: "Daredevil", abbr: "Dar", color: "", isBase: false, fk_base: 6 },
	{ id: 16, name: "Berserker", abbr: "Brs", color: "", isBase: false, fk_base: 7 },
	{ id: 17, name: "Dragonhunter", abbr: "Dgh", color: "", isBase: false, fk_base: 8 },
	{ id: 18, name: "Herald", abbr: "Her", color: "", isBase: false, fk_base: 9 },
	// Path of Fire
	{ id: 19, name: "Weaver", abbr: "Wea", color: "", isBase: false, fk_base: 1 },
	{ id: 20, name: "Mirage", abbr: "Mir", color: "", isBase: false, fk_base: 2 },
	{ id: 21, name: "Scourge", abbr: "Scg", color: "", isBase: false, fk_base: 3 },
	{ id: 22, name: "Soulbeast", abbr: "Slb", color: "", isBase: false, fk_base: 4 },
	{ id: 23, name: "Holosmith", abbr: "Hls", color: "", isBase: false, fk_base: 5 },
	{ id: 24, name: "Deadeye", abbr: "Ded", color: "", isBase: false, fk_base: 6 },
	{ id: 25, name: "Spellbreaker", abbr: "Spb", color: "", isBase: false, fk_base: 7 },
	{ id: 26, name: "Firebrand", abbr: "Fbd", color: "", isBase: false, fk_base: 8 },
	{ id: 27, name: "Renegade", abbr: "Ren", color: "", isBase: false, fk_base: 9 },
	// End of Dragons
	{ id: 28, name: "Catalyst", abbr: "Cat", color: "", isBase: false, fk_base: 1 },
	{ id: 29, name: "Virtuoso", abbr: "Vit", color: "", isBase: false, fk_base: 2 },
	{ id: 30, name: "Harbinger", abbr: "Har", color: "", isBase: false, fk_base: 3 },
	{ id: 31, name: "Untamed", abbr: "Utd", color: "", isBase: false, fk_base: 4 },
	{ id: 32, name: "Mechanist", abbr: "Mec", color: "", isBase: false, fk_base: 5 },
	{ id: 33, name: "Specter", abbr: "Spc", color: "", isBase: false, fk_base: 6 },
	{ id: 34, name: "Bladesworn", abbr: "Bls", color: "", isBase: false, fk_base: 7 },
	{ id: 35, name: "Willbender", abbr: "Wlb", color: "", isBase: false, fk_base: 8 },
	{ id: 36, name: "Vindicator", abbr: "Vin", color: "", isBase: false, fk_base: 9 },
];