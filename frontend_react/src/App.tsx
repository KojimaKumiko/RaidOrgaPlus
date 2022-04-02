import React, { useState } from "react";
import logo from "./logo.svg";
import { styled } from "@mui/material/styles";
import {
	Box,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	CssBaseline
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
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

	const handleDrawer = () => {
		setOpen(!open);
	};

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="handle drawer"
						onClick={handleDrawer}
						sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						RaidOrga+
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
				}}
				open={open}
				anchor="left"
				variant="persistent">
				<Toolbar />
				<Box sx={{ overflow: "auto" }}>
					<List>
						{["Home", "Meine Raids", "Profil", "Einstellungen", "Hilfe", "Moderation"].map(
							(text, index) => (
								<ListItem button key={text}>
									<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
									<ListItemText primary={text} />
								</ListItem>
							)
						)}
					</List>
				</Box>
			</Drawer>
			<Main open={open}>
				<Toolbar />
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
			</Main>
		</Box>
	);
}

export default App;
