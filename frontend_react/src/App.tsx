import { useEffect, useState } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Box, useMediaQuery, useTheme } from "@mui/material";

import { getUser, selectLoadingStatus, selectLoginState } from "./store/slices/userSlice";
import { saveWindowWidth } from "./store/slices/baseSlice";
import AppToolbar from "./components/AppToolbar";
import MenuDrawer from "./components/MenuDrawer";
import LoginPage from "./pages/LoginPage";
import Spinner from "./components/Spinner";
import "./App.css";

const drawerWidth = 240;

function App() {
	const [open, setOpen] = useState(true);
	const [showContent, setShowContent] = useState(false);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const loginState = useSelector(selectLoginState);
	const loadingStatus = useSelector(selectLoadingStatus);
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
		switch (loadingStatus) {
			case "idle":
				dispatch(getUser());
				break;
			case "finished":
				setLoading(false);
				break;
		}

		if (loginState === 1) {
			setShowContent(true);
		}
	}, [loadingStatus, loginState, dispatch]);

	useEffect(() => {
		const handleResize = () => {
			dispatch(saveWindowWidth(window.innerWidth));

			if (window.innerWidth >= 1200) {
				setOpen(true);
			} else {
				setOpen(false);
			}
		};

		// initialize the window width.
		dispatch(saveWindowWidth(window.innerWidth));

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [dispatch, showContent]);

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
