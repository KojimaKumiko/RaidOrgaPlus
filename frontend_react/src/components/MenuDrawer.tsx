import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { Box, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Stack } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import { selectLoggedInUser } from "../store/slices/userSlice";
import ProfileAvatar from "./UserProfile/ProfileAvatar";

import { User } from "../../../models/Types";

interface IProps {
	drawerWidth: number;
	open: boolean;
	visible: boolean;
}

const MenuDrawer = (props: IProps) => {
	const loggedInUser = useSelector(selectLoggedInUser) as User;
	
	const drawerStyle = {
		width: props.drawerWidth,
		flexShrink: 0,
		[`& .MuiDrawer-paper`]: { width: props.drawerWidth, boxSizing: "border-box" },
	};

	const links = [
		{ name: "Home", link: "/" },
		{ name: "Meine Raids", link: "/raids" },
		{ name: "Profil", link: "/profile" },
		{ name: "Einstellungen", link: "/settings" },
		{ name: "Hilfe", link: "/help" },
		{ name: "Moderation", link: "/moderation" },
	]
	
	return (
		<Drawer
			sx={[ drawerStyle, !props.visible && { "display": "none" } ]}
			open={props.open}
			anchor="left"
			variant="persistent">
			<Toolbar />
			<Box sx={{ overflow: "auto" }}>
				<List>
					<Stack direction="row" sx={{ marginLeft: 2, marginTop: 1 }}>
						<ProfileAvatar user={loggedInUser} sx={{ marginTop: "auto", marginBottom: "auto" }} />
						<p style={{ marginLeft: 16 }}> { loggedInUser?.name } </p>
					</Stack>
					{links.map((linkObject, index) => (
						<ListItem button key={linkObject.name} component={Link} to={linkObject.link}>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={linkObject.name} />
						</ListItem>
					))}
				</List>
			</Box>
		</Drawer>
	);
};

export default MenuDrawer;
