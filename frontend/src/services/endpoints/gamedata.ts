import con from "../connector";
import { Encounter } from "models/Encounter";
import { wingStrike } from "../../../../models/Types";
import { Class } from "../../../../models/Klasse";

export default {
	listEncounter,
	listEncounterGrouped,
	listEncounterGroupedStrikes,
	listEncounterForWing,
	listEncounterForStrike,
	getClassesForBase,
	getWings,
	getWingsAndStrikes,
	getAchievements,
};

async function listEncounter(): Promise<Encounter[]> {
	return await con("gamedata/encounter", "get", {}, false);
}

async function listEncounterGrouped(): Promise<Encounter[][]> {
	return await con("gamedata/encounter", "get", { grouped: 1 }, false);
}

async function listEncounterGroupedStrikes(): Promise<Encounter[][]> {
	return await con("gamedata/encounter/strikes", "get", { grouped: 1 }, false);
}

async function listEncounterForWing(wing: number): Promise<Encounter[]> {
	return await con("gamedata/encounter", "get", { wing }, false);
}

async function listEncounterForStrike(strike: number): Promise<Encounter[]> {
	return await con("gamedata/encounter", "get", { strike }, false);
}

async function getClassesForBase(base: number): Promise<Class[]> {
	return await con("gamedata/classes", "get", { base }, false);
}

async function getWings(): Promise<any> {
	return await con("gamedata/wings", "get", {}, false);
}

async function getWingsAndStrikes(): Promise<wingStrike[]> {
	return await con("gamedata/wingsStrikes", "get", {}, false);
}

async function getAchievements(): Promise<any> {
	return await con("gamedata/achievements", "get", {}, false);
}
