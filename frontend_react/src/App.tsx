import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Toolbar, Typography } from "@mui/material";
import "./App.css";
import AppToolbar from "./components/AppToolbar";
import MenuDrawer from "./components/MenuDrawer";
import LoginPage from "./pages/LoginPage";
import Counter from "./components/Counter/Counter";
import { Outlet } from "react-router-dom";
import { get } from "./services/endpoints/user";
import Spinner from "./components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { getUser, selectLoadingStatus, selectLoginState } from "./store/slices/userSlice";

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
			setShowContent(true)
		}
	}, [loadingStatus, loginState, dispatch]);

	const handleDrawer = () => {
		setOpen(!open);
	};

	return (
		<Box sx={{ display: "flex" }}>
			<AppToolbar onClick={handleDrawer} />
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
