import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface IProps {
	onClick: () => void;
}

const AppToolbar = (props: IProps) => {
	return (
		<AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
			<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="handle drawer"
					onClick={props.onClick}
					sx={{ mr: 2 }}>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					RaidOrga+
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default AppToolbar;
