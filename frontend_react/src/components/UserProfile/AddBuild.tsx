import { useState } from "react";
import { Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import ClassMenu from "../Aufstellung/ClassMenu";
import RoleMenu from "../Aufstellung/RoleMenu";
import BuildChip from "./BuildChip";

import { Build } from "models/Build";
import { Class } from "models/Klasse";
import { Role } from "models/Rolle";

interface Props {
	build: Build;
	onClassPick: (specilization: Class) => void;
	onRolePick: (role: Role) => void;
}

const AddBuild = (props: Props) => {
	const { build } = props;

	return (
		<Grid container spacing={1}>
			<Grid xs={6}>
				<ClassMenu onClassPick={props.onClassPick} />
			</Grid>
			<Grid xs={6}>
				<RoleMenu onRolePick={props.onRolePick} />
			</Grid>
			<Grid xs={12}>
				<BuildChip build={build} edit />
			</Grid>
		</Grid>
	);
};

export default AddBuild;
