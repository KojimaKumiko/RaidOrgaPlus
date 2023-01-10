import { useState } from "react";
import { Stack, Typography } from "@mui/material";

import ClassMenu from "../Aufstellung/ClassMenu";
import RoleMenu from "../Aufstellung/RoleMenu";
import BuildChip from "./BuildChip";

import { Build } from "models/Build";
import { Class } from "models/Klasse";

const AddBuild = () => {
	const [build, setBuild] = useState<Build>({ class: { abbr: "" } as Class, role: [], prefer: 0 });

	return (
		<Stack alignItems="flex-start">
			<Stack direction="row">
				<ClassMenu />
				<RoleMenu />
			</Stack>
			<BuildChip build={build} edit />
		</Stack>
	);
}

export default AddBuild;