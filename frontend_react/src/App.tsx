import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { styled } from "@mui/material/styles";
import { Box, Toolbar } from "@mui/material";

import { getUser, selectLoadingStatus, selectLoginState } from "./store/slices/userSlice";
import { saveWindowWidth } from "./store/slices/baseSlice";
import AppToolbar from "./components/AppToolbar";
import MenuDrawer from "./components/MenuDrawer";
import LoginPage from "./pages/LoginPage";
import Spinner from "./components/Spinner";
import "./App.css";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
	open?: boolean;
}>(({ theme, open }) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: `-${drawerWidth}px`,
	...(open && {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	}),
}));

function App() {
	const [open, setOpen] = useState(true);
	const [showContent, setShowContent] = useState(false);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const loginState = useSelector(selectLoginState);
	const loadingStatus = useSelector(selectLoadingStatus);

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
		};

		// initialize the window width.
		dispatch(saveWindowWidth(window.innerWidth));

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		}
	}, [dispatch]);

	const handleDrawer = () => {
		setOpen(!open);
	};

	return (
		<Box sx={{ display: "flex" }}>
			<AppToolbar onClick={handleDrawer} visible={showContent} />
			<MenuDrawer drawerWidth={drawerWidth} open={open} visible={showContent} />
			<Main open={open}>
				<Toolbar />
				{loading ? (
					<Spinner loading={loading} style={{ position: "absolute", top: "50%", left: "50%" }} />
				) : showContent ? (
					<Outlet />
				) : (
					<LoginPage />
				)}
			</Main>
		</Box>
	);
}

export default App;
