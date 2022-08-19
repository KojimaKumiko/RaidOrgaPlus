/** @jsxImportSource @emotion/react */
import { Fragment, useState } from "react";

import { Button, css, Dialog, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

import { User } from "models/Types";

interface Props {
	user: User;
}

const style = {
	stack: css({
		marginTop: 12,
		marginLeft: 9,
	}),
	button: css({
		borderRadius: 16,
		marginRight: 8,
	}),
};

const EditUser = () => {
	return (
		<Fragment>
			<h3>Spieler Rang</h3>
			<ToggleButtonGroup exclusive>
				<ToggleButton value="0">Normal</ToggleButton>
				<ToggleButton value="1">Raider</ToggleButton>
				<ToggleButton value="2">MaZ</ToggleButton>
				<ToggleButton value="3">Moderator</ToggleButton>
			</ToggleButtonGroup>
		</Fragment>
	);
};

const GuildHistory = () => {
	return (
		<Fragment>
			<h3>Gildenhistorie</h3>
		</Fragment>
	);
};

const RoleHistory = () => {
	return (
		<Fragment>
			<h3>Rolenhistorie</h3>
		</Fragment>
	);
};

const Archive = () => {
	return (
		<Fragment>
			<h3>Archivieren</h3>
		</Fragment>
	);
};

const UserActions = (props: Props) => {
	const [open, setOpen] = useState(false);
	const [comp, setComp] = useState("");

	const handleClose = () => {
		setOpen(false);
	};

	const handleClick = (comp: string) => {
		setComp(comp);
		setOpen(true);
	};

	const showComponent = () => {
		switch (comp) {
			case "edit":
				return <EditUser />;
			case "guild":
				return <GuildHistory />;
			case "role":
				return <RoleHistory />;
			case "archive":
				return <Archive />;
			default:
				break;
		}
	};

	return (
		<Stack direction="row" css={style.stack}>
			<Button variant="contained" color="neutral" css={style.button} disabled>
				Profile
			</Button>
			<Button variant="contained" color="neutral" css={style.button} onClick={() => handleClick("edit")}>
				Bearbeiten
			</Button>
			<Button variant="contained" color="neutral" css={style.button} onClick={() => handleClick("guild")}>
				Gildenhistorie
			</Button>
			<Button variant="contained" color="neutral" css={style.button} onClick={() => handleClick("role")}>
				Rolenhistorie
			</Button>
			<Button variant="contained" color="neutral" css={style.button} onClick={() => handleClick("archive")}>
				Archivieren
			</Button>
			<Dialog open={open} onClose={handleClose}>
				{showComponent()}
			</Dialog>
		</Stack>
	);
};

export default UserActions;
