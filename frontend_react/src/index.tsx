import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Typography } from "@mui/material";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Counter from "./components/Counter/Counter";

const theme = createTheme({
	palette: {
		mode: "dark"
	}
});

const container = document.getElementById("root");

const Raids = () => <span>Raids!</span>;
const Profile = () => <span>Profile!</span>
const Settings = () => <span>Settings!</span>;
const Help = () => <span>Help!</span>;
const Moderation = () => <span>Moderation!</span>;
const Main = () => {
	return (
		<span>
			<Typography paragraph>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
				et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at
				ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis
				convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean
				sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod
				quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris
				commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue
				eget arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
				donec massa sapien faucibus et molestie ac.
			</Typography>
			<Typography paragraph>
				Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla facilisi
				etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac tincidunt. Ornare
				suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat mauris. Elementum
				eu facilisis sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
				ornare massa eget egestas purus viverra accumsan in. In hendrerit gravida rutrum quisque non tellus
				orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant morbi tristique senectus et.
				Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
				eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
				ultrices sagittis orci a.
			</Typography>
		</span>
	)
}

const root = createRoot(container!);
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<App />}>
							<Route index element={<Main />} />
							<Route path="raids" element={<Raids />} />
							<Route path="profile" element={<Profile />} />
							<Route path="settings" element={<Settings />} />
							<Route path="help" element={<Help />} />
							<Route path="moderation" element={<Counter />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
