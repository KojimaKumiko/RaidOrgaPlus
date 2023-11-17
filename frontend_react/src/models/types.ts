import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { Spieler, SpielerTermin } from "models/Spieler";
import { Termin } from "models/Termin";
import { element } from "models/Types";

export type InputTarget = EventTarget & (HTMLInputElement | HTMLTextAreaElement);
export interface CompPageLoader {
	termin: Termin;
	composition: (Aufstellung & Encounter)[];
	elements: element[];
	signUps: (Spieler & SpielerTermin)[];
	signUpPlayer: number | null;
}

export interface CompPlayer {
	id: number;
	accname: string;
	name: string;
}