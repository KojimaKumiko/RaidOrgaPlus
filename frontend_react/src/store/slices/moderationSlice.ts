import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getUsers } from "../../services/endpoints/moderation";

import { User } from "models/Types";
import { type RootState } from "../store";

export interface ModerationState {
	users: User[];
	usersLoadingStatus: "idle" | "loading" | "finished";
}

const initialState: ModerationState = {
	users: [],
	usersLoadingStatus: "idle"
};

export const getUsersThunk = createAsyncThunk(
	"moderation/getUsers",
	async () => {
		const response = await getUsers();
		return response;
	},
	{
		condition: (payload, { getState, extra }) => {
			const { moderation } = getState() as RootState;
			if (moderation.usersLoadingStatus === "loading" || moderation.usersLoadingStatus === "finished") {
				return false;
			}
		},
	}
);

export const moderationSlice = createSlice({
	name: "moderation",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(getUsersThunk.pending, (state, action) => {
				state.usersLoadingStatus = "loading";
			})
			.addCase(getUsersThunk.fulfilled, (state, action) => {
				state.users = action.payload;
				state.usersLoadingStatus = "finished";
			})
			.addCase(getUsersThunk.rejected, (state, action) => {
				state.usersLoadingStatus = "finished";
			});
	},
});

export const selectUsers = (state: RootState) => state.moderation.users;

export default moderationSlice.reducer;