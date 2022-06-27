import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface BaseState {
	windowWidth: number;
}

const initialState: BaseState = {
	windowWidth: 0
};

export const baseSlice = createSlice({
	name: "base",
	initialState,
	reducers: {
		saveWindowWidth(state, action: PayloadAction<number>) {
			state.windowWidth = action.payload;
		}
	},
});

export const selectWindowWidth = (state: RootState) => state.base.windowWidth;

export const { saveWindowWidth } = baseSlice.actions;
export default baseSlice.reducer;