import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Termin } from "models/Termin";
import { RootState } from "../store";

export interface TerminState {
	termin?: Termin;
}

const initialState: TerminState = {
	termin: undefined
};

export const terminSlice = createSlice({
	name: "termin",
	initialState,
	reducers: {
		setTermin(state, action: PayloadAction<Termin>) {
			state.termin = action.payload;
		}
	}
});

export const selectTermin = (state: RootState) => state.termin.termin;

export const { setTermin } = terminSlice.actions;
export default terminSlice.reducer;