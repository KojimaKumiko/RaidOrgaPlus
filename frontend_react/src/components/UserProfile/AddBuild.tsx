import { useState } from "react";
import { Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import ClassMenu from "../Aufstellung/ClassMenu";
import RoleMenu from "../Aufstellung/RoleMenu";
import BuildChip from "./BuildChip";

import { Build } from "models/Build";
import { Class } from "models/Klasse";

const AddBuild = () => {
	const [build, setBuild] = useState<Build>({ class: { abbr: "" } as Class, role: [], prefer: 0 });

	return (
		<Grid container spacing={1}>
			<Grid xs={6}>
				<ClassMenu />
			</Grid>
			<Grid xs={6}>
				<RoleMenu />
			</Grid>
			<Grid xs={12}>
				<BuildChip build={build} edit />
			</Grid>
		</Grid>
	);
}

export default AddBuild;