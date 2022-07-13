import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import counterReducer from "../components/Counter/counterSlice";
import userReducer from "./slices/userSlice";
import baseReducer from "./slices/baseSlice";
import moderationReducer from "./slices/moderationSlice";

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		user: userReducer,
		base: baseReducer,
		moderation: moderationReducer
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
