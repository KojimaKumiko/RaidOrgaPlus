import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Spieler } from "../../../../models/Spieler";
import { get } from "../../services/endpoints/user";
import { RootState } from "../store";

export interface UserState {
	loggedInUser?: Spieler;
	loginState: number;
	buildCheck?: string;
	frontendBuild: string;
	loadingStatus: "idle" | "loading" | "finished";
}

const initialState: UserState = {
	loggedInUser: undefined,
	loginState: 0,
	buildCheck: undefined,
	frontendBuild: "v2.4.1",
	loadingStatus: "idle",
};

export const getUser = createAsyncThunk(
	"user/getUser",
	async () => {
		// return await get();
		const response = await get();
		return response;
	},
	{
		condition: (payload, { getState, extra }) => {
			const { user } = getState() as RootState;
			if (user.loadingStatus === "loading" || user.loadingStatus === "finished") {
				return false;
			}
		},
	}
);

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(getUser.pending, (state, action) => {
				state.loadingStatus = "loading";
			})
			.addCase(getUser.fulfilled, (state, action) => {
				if (action.payload != null && action.payload instanceof Object) {
					state.loginState = 1;
					state.loggedInUser = action.payload;
				} else {
					state.loginState = -1;
				}

				state.loadingStatus = "finished";
			})
			.addCase(getUser.rejected, (state, action) => {
				state.loginState = -1;
				state.loadingStatus = "finished";
			});
	},
});

export const selectLoadingStatus = (state: RootState) => state.user.loadingStatus;
export const selectLoginState = (state: RootState) => state.user.loginState;
export const selectLoggedInUser = (state: RootState) => state.user.loggedInUser;

export default userSlice.reducer;
