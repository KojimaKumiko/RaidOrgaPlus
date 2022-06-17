import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import counterReducer from "../components/Counter/counterSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		user: userReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
