import { Encounter } from "models/Encounter";
import { Wing } from "models/Wing";
import { query, queryV } from "../../../database/connector";

export async function listByWing(): Promise<Encounter[][]> {
	const stmt = "SELECT * FROM Encounter";
	try {
		const response: Encounter[] = await query(stmt);
		const ret: Encounter[][] = [];

		response
			.filter((r) => r.wing != null)
			.forEach((r) => {
				const wing = r.wing - 1;
				if (!ret[wing]) {
					ret[wing] = [];
				}

				ret[wing].push(r);
			});

		return ret;
	} catch (e) {
		throw e;
	}
}

export async function listByStrike(): Promise<Encounter[][]> {
	const stmt = "SELECT * FROM Encounter";
	try {
		const response: Encounter[] = await query(stmt);
		const ret: Encounter[][] = [];

		response
			.filter((r) => r.strike != null)
			.forEach((r) => {
				const strike = r.strike - 1;
				if (!ret[strike]) {
					ret[strike] = [];
				}

				ret[strike].push(r);
			});

		return ret;
	} catch (e) {
		throw e;
	}
}

export async function list(): Promise<Encounter[]> {
	const stmt = "SELECT * FROM Encounter";
	try {
		return await query(stmt);
	} catch (e) {
		throw e;
	}
}

export async function listForWing(wing: number): Promise<Encounter[]> {
	const stmt = "SELECT * FROM Encounter WHERE wing = ?";
	try {
		return await queryV(stmt, wing);
	} catch (e) {
		throw e;
	}
}

export async function listForStrike(strike: number): Promise<Encounter[]> {
	const stmt = "SELECT * FROM Encounter WHERE strike = ?";
	try {
		return await queryV(stmt, strike);
	} catch (e) {
		throw e;
	}
}

export async function getWings(): Promise<Wing[]> {
	const stmt = "SELECT * FROM Wing";
	try {
		return await query(stmt);
	} catch (e) {
		throw e;
	}
}

export async function getStrikes(): Promise<Wing[]> {
	const stmt = "SELECT * FROM Strikes";
	try {
		return await query(stmt);
	} catch (e) {
		throw e;
	}
}