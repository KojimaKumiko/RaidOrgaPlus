import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Termin } from "models/Termin";
import { RootState } from "../store";
import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { Spieler, SpielerTermin } from "models/Spieler";
import { element } from "models/Types";
import { CompPlayer } from "../../models/types";
import { Class } from "models/Klasse";
import { Role } from "models/Rolle";

export interface TerminState {
	termin?: Termin;
	composition: (Aufstellung & Encounter)[];
	elements: element[];
	signUps: (Spieler & SpielerTermin)[];
	signUpPlayer: number | null;
}

const initialState: TerminState = {
	termin: undefined,
	composition: [],
	elements: [],
	signUps: [],
	signUpPlayer: null
};

export const terminSlice = createSlice({
	name: "termin",
	initialState,
	reducers: {
		setTermin(state, action: PayloadAction<Termin>) {
			state.termin = action.payload;
		},
		setComposition(state, action: PayloadAction<(Aufstellung & Encounter)[]>) {
			state.composition = action.payload;
		},
		setElements(state, action: PayloadAction<element[]>) {
			state.elements = action.payload;
		},
		setSignUps(state, action: PayloadAction<(Spieler & SpielerTermin)[]>) {
			state.signUps = action.payload;
		},
		setSignUpPlayer(state, action: PayloadAction<number | null>) {
			state.signUpPlayer = action.payload;
		},
		setName(state, action: PayloadAction<{ compId: number, position: number, user: CompPlayer }>) {
			const { compId, position, user } = action.payload;
			const element = getElement(state.elements, compId, position);
			element.id = user.id;
			element.accname = user.accname;
			element.name = user.name;
			state.elements = state.elements.filter(e => e.aufstellung !== element.aufstellung || e.pos !== element.pos);
			state.elements.push(element);
		},
		clearName(state, action: PayloadAction<{ compId: number, position: number }>) {
			const { compId, position } = action.payload;
			const element = getElement(state.elements, compId, position);
			element.id = 0;
			element.accname = "???";
			element.name = "???";
			state.elements = state.elements.filter(e => e.aufstellung !== element.aufstellung || e.pos !== element.pos);
			state.elements.push(element);
		},
		setClass(state, action: PayloadAction<{ compId: number, position: number, cls: Class }>) {
			const { compId, position, cls } = action.payload;
			const element = getElement(state.elements, compId, position);
			element.class = cls.abbr;
			state.elements = state.elements.filter(e => e.aufstellung !== element.aufstellung || e.pos !== element.pos);
			state.elements.push(element);
		},
		addRole(state, action: PayloadAction<{}>) {

		},
		setRole(state, action: PayloadAction<{ compId: number, position: number, role: Role, index: number }>) {
			const { compId, position, role, index } = action.payload;
			const element = getElement(state.elements, compId, position);
			element.roles[index] = role;
			state.elements = state.elements.filter(e => e.aufstellung !== element.aufstellung || e.pos !== element.pos);
			state.elements.push(element);
		},
		addElement(state, action: PayloadAction<element>) {
			const element = action.payload;
			state.elements = state.elements.filter(e => e.aufstellung !== element.aufstellung || e.pos !== element.pos);
			state.elements.push(element);
		}
	}
});

const getElement = (elements: element[], compId: number, position: number): element => {
	const element = elements.find(e => e.aufstellung === compId && e.pos === position);
	if (element) {
		return element;
	}

	return {
		aufstellung: compId,
		pos: position,
		class: "",
		role: "",
		name: "???",
		accname: "???",
		id: 0,
		roles: [],
	} as unknown as element;
};

export const selectTermin = (state: RootState) => state.termin.termin;
export const selectComposition = (state: RootState) => state.termin.composition;
export const selectElements = (state: RootState) => state.termin.elements;
export const selectSignUps = (state: RootState) => state.termin.signUps;
export const selectSignUpPlayer = (state: RootState) => state.termin.signUpPlayer;

export const { setTermin, setComposition, setElements, setSignUps, setSignUpPlayer, setName, clearName, setClass, setRole, addRole, addElement } = terminSlice.actions;
export default terminSlice.reducer;