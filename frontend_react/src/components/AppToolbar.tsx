/** @jsxImportSource @emotion/react */
import { useState } from "react";

import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Dialog,
	Card,
	CardContent,
	css,
	CardActions,
	Button,
} from "@mui/material";
import { Logout, Menu, Copyright } from "@mui/icons-material";

import LegalNotice from "./Misc/LeaglNotice";
import { invalidateSession } from "../services/endpoints/user";
import { deleteCookie } from "../services/cookies";

const style = {
	card: css({
		overflow: "inherit",
	}),
	cardAction: css({
		justifyContent: "flex-end",
	}),
};

interface IProps {
	onClick: () => void;
	visible: boolean;
}

const AppToolbar = (props: IProps) => {
	const [open, setOpen] = useState(false);

	const handleCopyRight = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleLogout = async () => {
		await invalidateSession();
		deleteCookie("session");
		window.location.reload();
	};

	return (
		<AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
			<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="handle drawer"
					onClick={props.onClick}
					sx={{ mr: 2 }}>
					<Menu />
				</IconButton>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					RaidOrga+
				</Typography>
				<IconButton onClick={handleCopyRight}>
					<Copyright />
				</IconButton>
				<IconButton onClick={handleLogout} sx={[!props.visible && { display: "none" }]}>
					<Logout />
				</IconButton>
				<Dialog open={open} onClose={handleClose} maxWidth="lg">
					<Card css={style.card}>
						<CardContent>
							<LegalNotice />
						</CardContent>
						<CardActions css={style.cardAction}>
							<Button onClick={handleClose}>Close</Button>
						</CardActions>
					</Card>
				</Dialog>
			</Toolbar>
		</AppBar>
	);
};

export default AppToolbar;
