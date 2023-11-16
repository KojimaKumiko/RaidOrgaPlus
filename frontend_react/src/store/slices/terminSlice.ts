import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Termin } from "models/Termin";
import { RootState } from "../store";
import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { Spieler, SpielerTermin } from "models/Spieler";
import { element } from "models/Types";

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
		addElement(state, action: PayloadAction<element>) {
			const element = action.payload;
			state.elements = state.elements.filter(e => e.aufstellung !== element.aufstellung || e.pos !== element.pos);
			state.elements.push(element);
		}
	}
});

export const selectTermin = (state: RootState) => state.termin.termin;
export const selectComposition = (state: RootState) => state.termin.composition;
export const selectElements = (state: RootState) => state.termin.elements;
export const selectSignUps = (state: RootState) => state.termin.signUps;
export const selectSignUpPlayer = (state: RootState) => state.termin.signUpPlayer;

export const { setTermin, setComposition, setElements, setSignUps, setSignUpPlayer, addElement } = terminSlice.actions;
export default terminSlice.reducer;