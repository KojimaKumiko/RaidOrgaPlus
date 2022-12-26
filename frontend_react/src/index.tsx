import React from "react";
import { createRoot } from "react-dom/client";
import {
	BrowserRouter,
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
	Routes,
} from "react-router-dom";
import { Provider } from "react-redux";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "@fontsource/roboto";
import "@fontsource/material-icons";

import { store } from "./store/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import HomePage from "./pages/HomePage";
import MyRaidPage from "./pages/MyRaidPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import ModerationPage from "./pages/ModerationPage";
import "./index.css";
import RaidPage from "./pages/Raids/RaidPage";
import MembersPage from "./pages/Raids/MembersPage";
import { getRaidFromId } from "./services/endpoints/raids";
import RaidDashboard from "./pages/Raids/RaidDashboard";

// import "./theme";

const theme = createTheme({
	palette: {
		mode: "dark",
		neutral: {
			main: "#272727",
			contrastText: "#fff",
		},
	},
	components: {
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					fontSize: 14,
				},
			},
		},
	},
});

const container = document.getElementById("root");

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			<Route index element={<HomePage />} />
			<Route path="raids" element={<MyRaidPage />} />
			<Route
				path="raids/:raidId"
				element={<RaidPage />}
				loader={async ({ params }) => {
					return await getRaidFromId(Number(params.raidId));
				}}>
				<Route index element={<RaidDashboard />} />
				<Route path="spielerliste" element={<MembersPage />} />
			</Route>
			<Route path="profile" element={<ProfilePage />} />
			<Route path="settings" element={<SettingsPage />} />
			<Route path="help" element={<HelpPage />} />
			<Route path="moderation" element={<ModerationPage />} />
		</Route>
	)
);

const root = createRoot(container!);
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<RouterProvider router={router} />
			</ThemeProvider>
		</Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
