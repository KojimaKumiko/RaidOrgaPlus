/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
	Box,
	Toolbar,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Stack,
	Dialog,
	useTheme,
	useMediaQuery,
	Icon,
	css,
} from "@mui/material";

import { selectLoggedInUser } from "../store/slices/userSlice";
import ProfileAvatar from "./UserProfile/ProfileAvatar";

import { User } from "../../../models/Types";
import Snake from "./Misc/Snake";

interface IProps {
	drawerWidth: number;
	open: boolean;
	visible: boolean;
	onClose: () => void;
}

const MenuDrawer = (props: IProps) => {
	const [open, setOpen] = useState(false);
	const loggedInUser = useSelector(selectLoggedInUser) as User;

	const style = {
		drawer: css({
			width: props.drawerWidth,
			flexShrink: 0,
			[`& .MuiDrawer-paper`]: { width: props.drawerWidth, boxSizing: "border-box" },
			...(!props.visible && {
				display: "none"
			})
		}),
		box: css({
			overflow: "auto",
			backgroundColor: "#363636",
			height: "100%",
		})
	}

	const links = [
		{ name: "Home", link: "/", icon: "home" },
		{ name: "Meine Raids", link: "/raids", icon: "explore" },
		{ name: "Profil", link: "/profile", icon: "account_circle" },
		{ name: "Einstellungen", link: "/settings", icon: "settings" },
		{ name: "Hilfe", link: "/help", icon: "help" },
		{ name: "Moderation", link: "/moderation", icon: "vpn_key" },
	];

	const handleClose = () => {
		setOpen(false);
	};

	const theme = useTheme();
	const greaterThanLargeBreakpoint = useMediaQuery(theme.breakpoints.up("lg"));

	return (
		<Drawer
			css={style.drawer}
			open={props.open}
			onClose={props.onClose}
			anchor="left"
			variant={greaterThanLargeBreakpoint ? "persistent" : "temporary"}>
			{/* required to prevent clipping from the Toolbar */}
			<Toolbar />
			<Box css={style.box}>
				<List>
					<Stack direction="row" sx={{ marginLeft: 2, marginTop: 1 }}>
						<ProfileAvatar
							user={loggedInUser}
							sx={{ marginTop: "auto", marginBottom: "auto" }}
							onDoubleClick={() => setOpen(true)}
						/>
						<p style={{ marginLeft: 16 }}> {loggedInUser?.name} </p>
					</Stack>
					{links.map((linkObject, index) => (
						<ListItem button key={linkObject.name} component={Link} to={linkObject.link}>
							<ListItemIcon>
								<Icon>{linkObject.icon}</Icon>
							</ListItemIcon>
							<ListItemText primary={linkObject.name} />
						</ListItem>
					))}
				</List>
			</Box>
			<Dialog open={open} onClose={handleClose} maxWidth="lg">
				<Snake />
			</Dialog>
		</Drawer>
	);
};

export default MenuDrawer;
