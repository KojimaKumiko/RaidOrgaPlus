import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";

import ClassMenu from "../Aufstellung/ClassMenu";
import RoleMenu from "../Aufstellung/RoleMenu";
import BuildChip from "./BuildChip";

import { Build } from "models/Build";
import { Class } from "models/Klasse";
import { Role } from "models/Rolle";

interface Props {
	open: boolean;
	build: Build;
	onClose: () => void;
	onClassPick: (specilization: Class) => void;
	onRolePick: (role: Role) => void;
	onRoleSizeChange: (type: "add" | "remove") => void;
	onRoleSelect?: (index: number | null) => void;
	onAddBuild: () => void;
}

const AddBuild = (props: Props) => {
	const { open, build, onClose, onClassPick, onRolePick, onRoleSizeChange, onRoleSelect, onAddBuild } = props;

	return (
		<Dialog open={open} maxWidth="xs">
			<DialogTitle>
				<Stack direction="row" justifyContent="space-between">
					<Typography>Build Hinzufügen</Typography>
					<HelpOutlinedIcon />
				</Stack>
			</DialogTitle>
			<DialogContent dividers>
				<Grid container spacing={1}>
					<Grid xs={6}>
						<ClassMenu onClassPick={onClassPick} />
					</Grid>
					<Grid xs={6}>
						<RoleMenu onRolePick={onRolePick} />
					</Grid>
					<Grid xs={12} sx={{ display: "flex", flexDirection: "row" }}>
						<BuildChip build={build} edit onRoleSizeChange={onRoleSizeChange} onRoleSelect={onRoleSelect} />
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Abbr.</Button>
				<Button onClick={onAddBuild}>Hinzufügen</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddBuild;
