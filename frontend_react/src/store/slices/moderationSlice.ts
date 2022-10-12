import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getUsers } from "../../services/endpoints/moderation";

import { User } from "models/Types";
import { type RootState } from "../store";
import { ExtraAccount } from "models/ExtraAccount";
import { UserRole } from "models/Enums";

export interface ModerationState {
	users: User[];
	usersLoadingStatus: "idle" | "loading" | "finished";
	filterName: string;
	filterRole: string;
	activeFilters: string[];
}

const initialState: ModerationState = {
	users: [],
	usersLoadingStatus: "idle",
	filterName: "",
	filterRole: "",
	activeFilters: ["Nicht Archiviert"],
};

export const getUsersThunk = createAsyncThunk(
	"moderation/getUsers",
	async (force?: boolean) => {
		const response = await getUsers();
		return response;
	},
	{
		condition: (payload, { getState, extra }) => {
			const { moderation } = getState() as RootState;

			if (payload && moderation.usersLoadingStatus === "finished") {
				return true;
			}

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
			state.activeFilters = state.activeFilters.filter((f) => f !== action.payload);
		},
		setNameFilter(state, action: PayloadAction<string>) {
			state.filterName = action.payload;
		},
		setRoleFilter(state, action: PayloadAction<string>) {
			state.filterRole = action.payload;
		},
		setComment(state, action: PayloadAction<{ id: number; comment: string }>) {
			let user = state.users.find((u) => u.id === action.payload.id)!;
			user.comment = action.payload.comment;
		},
		setUserRole(state, action: PayloadAction<{ id: number; role: UserRole }>) {
			let user = state.users.find(u => u.id === action.payload.id)!;
			user.role = action.payload.role;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getUsersThunk.pending, (state, action) => {
				state.usersLoadingStatus = "loading";
				if (action.meta.arg) {
					state.users = [];
				}
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

const filter = (users: User[], textFilter: string, roleFilter: string, filters: string[]): User[] => {
	return users.filter((u) => isInFilter(u, textFilter, roleFilter, filters));
};

const isInFilter = (user: User, filterText: string, roleFilter: string, filters: string[]): boolean => {
	return isInNameFilter(user, filterText) && isInRoleFilter(user, roleFilter) && isInChipFilter(user, filters);
};

const isInChipFilter = (user: User, filters: string[]): boolean => {
	for (const filter of filters) {
		let currentTruth = false;
		let date: number, diff: number;
		switch (filter) {
			case "Mit Discord":
				currentTruth = !!user.discord;
				break;
			case "Ohne Discord":
				currentTruth = !!!user.discord;
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
};

const isInNameFilter = (user: User, filterText: string): boolean => {
	const name = user.name.toLowerCase();
	const accname = user.accname.toLowerCase();
	const searchText = filterText.toLowerCase();
	let inExtraAccounts = false;

	if (user.extraAccounts && user.extraAccounts.length > 0) {
		inExtraAccounts = user.extraAccounts.some(
			(e: ExtraAccount) => e.accName.toLowerCase().indexOf(searchText) > -1
		);
	}

	return name.indexOf(searchText) > -1 || accname.indexOf(searchText) > -1 || inExtraAccounts;
};

const isInRoleFilter = (user: User, roleFilter: string): boolean => {
	if (roleFilter === "") {
		return true;
	}

	if (!user.discord) {
		return false;
	}

	const searchText = roleFilter.toLowerCase();
	return !!user.discord.roles.find((r: any) => r.name.toLowerCase().indexOf(searchText) > -1);
};

export const selectUsers = (state: RootState) => state.moderation.users;
export const selectUserLength = (state: RootState) => state.moderation.users.length;
export const selectFilteredUsers = (state: RootState) =>
	filter(
		state.moderation.users,
		state.moderation.filterName,
		state.moderation.filterRole,
		state.moderation.activeFilters
	);
export const selectActiveFilters = (state: RootState) => state.moderation.activeFilters;

export const { addFilter, removeFilter, setNameFilter, setRoleFilter, setComment, setUserRole } = moderationSlice.actions;
export default moderationSlice.reducer;
