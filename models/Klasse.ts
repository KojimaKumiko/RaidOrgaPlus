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
	{ id: 1, name: "Tempest", abbr: "Tmp", color: "", isBase: true, fk_base: 1 },
	{ id: 2, name: "Chronomancer", abbr: "Chr", color: "", isBase: true, fk_base: 2 },
	{ id: 3, name: "Reaper", abbr: "Rea", color: "", isBase: true, fk_base: 3 },
	{ id: 4, name: "Druid", abbr: "Dru", color: "", isBase: true, fk_base: 4 },
	{ id: 5, name: "Scrapper", abbr: "Scr", color: "", isBase: true, fk_base: 5 },
	{ id: 6, name: "Daredevil", abbr: "Dar", color: "", isBase: true, fk_base: 6 },
	{ id: 7, name: "Berserker", abbr: "Brs", color: "", isBase: true, fk_base: 7 },
	{ id: 8, name: "Dragonhunter", abbr: "Dgh", color: "", isBase: true, fk_base: 8 },
	{ id: 9, name: "Herald", abbr: "Her", color: "", isBase: true, fk_base: 9 },
	// Path of Fire
	{ id: 1, name: "Weaver", abbr: "Wea", color: "", isBase: true, fk_base: 1 },
	{ id: 2, name: "Mirage", abbr: "Mir", color: "", isBase: true, fk_base: 2 },
	{ id: 3, name: "Scourge", abbr: "Scg", color: "", isBase: true, fk_base: 3 },
	{ id: 4, name: "Soulbeast", abbr: "Slb", color: "", isBase: true, fk_base: 4 },
	{ id: 5, name: "Holosmith", abbr: "Hls", color: "", isBase: true, fk_base: 5 },
	{ id: 6, name: "Deadeye", abbr: "Ded", color: "", isBase: true, fk_base: 6 },
	{ id: 7, name: "Spellbreaker", abbr: "Spb", color: "", isBase: true, fk_base: 7 },
	{ id: 8, name: "Firebrand", abbr: "Fbd", color: "", isBase: true, fk_base: 8 },
	{ id: 9, name: "Renegade", abbr: "Ren", color: "", isBase: true, fk_base: 9 },
	// End of Dragons
	{ id: 1, name: "Catalyst", abbr: "Cat", color: "", isBase: true, fk_base: 1 },
	{ id: 2, name: "Virtuoso", abbr: "Vit", color: "", isBase: true, fk_base: 2 },
	{ id: 3, name: "Harbinger", abbr: "Har", color: "", isBase: true, fk_base: 3 },
	{ id: 4, name: "Untamed", abbr: "Utd", color: "", isBase: true, fk_base: 4 },
	{ id: 5, name: "Mechanist", abbr: "Mec", color: "", isBase: true, fk_base: 5 },
	{ id: 6, name: "Specter", abbr: "Spc", color: "", isBase: true, fk_base: 6 },
	{ id: 7, name: "Bladesworn", abbr: "Bls", color: "", isBase: true, fk_base: 7 },
	{ id: 8, name: "Willbender", abbr: "Wlb", color: "", isBase: true, fk_base: 8 },
	{ id: 9, name: "Vindicator", abbr: "Vin", color: "", isBase: true, fk_base: 9 },
];