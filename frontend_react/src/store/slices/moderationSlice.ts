import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getUsers } from "../../services/endpoints/moderation";

import { User } from "models/Types";
import { type RootState } from "../store";

export interface ModerationState {
	users: User[];
	usersLoadingStatus: "idle" | "loading" | "finished";
	filteredUsers: User[];
	filterName: string;
	filterRole: string;
	activeFilters: string[];
}

const initialState: ModerationState = {
	users: [],
	usersLoadingStatus: "idle",
	filteredUsers: [],
	filterName: "",
	filterRole: "",
	activeFilters: ["Nicht Archiviert"],
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
	reducers: {
		addFilter(state, action: PayloadAction<string>) {
			state.activeFilters.push(action.payload);
		},
		removeFilter(state, action: PayloadAction<string>) {
			state.activeFilters = state.activeFilters.filter(f => f !== action.payload);
		},
		filterUsers(state) {
			state.filteredUsers = filter(state.users, state.activeFilters);
		},
		setNameFilter(state, action: PayloadAction<string>) {
			state.filterName = action.payload;
		},
		setRoleFilter(state, action: PayloadAction<string>) {
			state.filterRole = action.payload;
		}
	},
	extraReducers(builder) {
		builder
			.addCase(getUsersThunk.pending, (state, action) => {
				state.usersLoadingStatus = "loading";
			})
			.addCase(getUsersThunk.fulfilled, (state, action) => {
				state.users = action.payload;
				state.filteredUsers = filter(action.payload, state.activeFilters);
				state.usersLoadingStatus = "finished";
			})
			.addCase(getUsersThunk.rejected, (state, action) => {
				state.usersLoadingStatus = "finished";
			});
	},
});

const filter = (users: User[], filters: string[]): User[] => {
	return users.filter(u => isInFilter(u, filters));
}

const isInFilter = (user: User, filters: string[]): boolean => {
	for (const filter of filters) {
		let currentTruth = false;
		let date: number, diff: number;
		switch (filter) {
			case "Mit Discord":
				currentTruth = !!user.discord;
				break;
			case "Ohne Discord":
				currentTruth = !(!!user.discord);
				break;
			case "14 Tage inaktiv":
				date = Number(new Date(user.lastActive));
				diff = Number(new Date()) - date;
				currentTruth = diff > 1000 * 60 * 60 * 24 * 14;
				break;
			case "1. Raid vier Wochen her":
				if (!user.firstTermin) return false;
				date = Number(new Date(user.firstTermin));
				diff = Number(new Date()) - date;
				currentTruth = diff > 1000 * 60 * 60 * 24 * 28;
				break;
			case "Archiviert":
				currentTruth = user.archived;
				break;
			case "Nicht Archiviert":
				currentTruth = !user.archived;
				break;
		}

		if (!currentTruth) {
			return false;
		}
	}
	return true;
}

export const selectUsers = (state: RootState) => state.moderation.filteredUsers;
export const selectUserLength = (state: RootState) => state.moderation.users.length;
export const selectFilterdLength = (state: RootState) => state.moderation.filteredUsers.length;
export const selectActiveFilters = (state: RootState) => state.moderation.activeFilters;

export const { addFilter, removeFilter, filterUsers } = moderationSlice.actions;
export default moderationSlice.reducer;