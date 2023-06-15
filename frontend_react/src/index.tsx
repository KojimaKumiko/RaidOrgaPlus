import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";
import "@fontsource/roboto";
import "@fontsource/material-icons";

import { store } from "./store/store";
import reportWebVitals from "./reportWebVitals";

import "./index.css";
import routes from "./routes";

// import "./theme";

const theme = createTheme({
	palette: {
		mode: "dark",
		neutral: {
			main: "#272727",
			contrastText: "#fff",
		},
		background: {
			main: "#1e1e1e",
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

const router = createBrowserRouter(routes());

const root = createRoot(container!);
root.render(
	// <React.StrictMode>
	<Provider store={store}>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<RouterProvider router={router} />
		</ThemeProvider>
	</Provider>
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
