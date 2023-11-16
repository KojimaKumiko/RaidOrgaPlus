import { useEffect, useState } from "react";
import { Outlet, useMatches } from "react-router-dom";

import { Box, useMediaQuery, useTheme } from "@mui/material";

import { getUser, selectLoadingStatus, selectLoginState } from "./store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { saveWindowWidth } from "./store/slices/baseSlice";
import AppToolbar from "./components/AppToolbar";
import MenuDrawer from "./components/MenuDrawer";
import Spinner from "./components/Spinner";
import LoginPage from "./pages/LoginPage";
import "./App.css";

const drawerWidth = 240;

function App() {
	const dispatch = useAppDispatch();
	const loginState = useAppSelector(selectLoginState);
	const loadingStatus = useAppSelector(selectLoadingStatus);

	const [open, setOpen] = useState(true);
	const loading = Boolean(loadingStatus !== "finished");
	const showContent = Boolean(loginState === 1);
	const theme = useTheme();
	const breakpoint = useMediaQuery(theme.breakpoints.up("lg"));
	const matches = useMatches();
	const raidPage = matches.some(m => m.params["raidId"] != null);

	const mainStyle = {
		flexGrow: 1,
		margin: "1% 2%",
		transition: theme.transitions.create("padding", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		...(open &&
			breakpoint && {
				transition: theme.transitions.create("padding", {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
				paddingLeft: `${drawerWidth}px`,
			}),
		...(raidPage && {
			margin: 0
		})
	};

	useEffect(() => {
		const handleResize = () => {
			dispatch(saveWindowWidth(window.innerWidth));

			if (window.innerWidth >= 1200) {
				setOpen(true);
			} else {
				setOpen(false);
			}
		};

		dispatch(getUser());

		// initialize the window width.
		dispatch(saveWindowWidth(window.innerWidth));

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleDrawer = () => {
		setOpen(!open);
	};

	const closeDrawer = () => {
		setOpen(false);
	};

	return (
		<Box>
			<AppToolbar onClick={handleDrawer} visible={showContent} />
			<MenuDrawer drawerWidth={drawerWidth} open={open} onClose={closeDrawer} visible={showContent} />
			{loading ? (
				<Spinner loading={loading} style={{ position: "absolute", top: "50%", left: "50%" }} />
			) : showContent ? (
				<main style={mainStyle}>
					<Outlet />
				</main>
			) : (
				<LoginPage />
			)}
		</Box>
	);
}

export default App;
