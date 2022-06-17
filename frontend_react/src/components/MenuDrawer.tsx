import { Box, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Link } from "react-router-dom";

interface IProps {
	drawerWidth: number;
	open: boolean;
	visible: boolean;
}

const MenuDrawer = (props: IProps) => {
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
