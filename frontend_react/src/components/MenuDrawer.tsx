import { Box, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

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
	
	return (
		<Drawer
			sx={[ drawerStyle, !props.visible && { "display": "none" } ]}
			open={props.open}
			anchor="left"
			variant="persistent">
			<Toolbar />
			<Box sx={{ overflow: "auto" }}>
				<List>
					{["Home", "Meine Raids", "Profil", "Einstellungen", "Hilfe", "Moderation"].map((text, index) => (
						<ListItem button key={text}>
							<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
			</Box>
		</Drawer>
	);
};

export default MenuDrawer;
