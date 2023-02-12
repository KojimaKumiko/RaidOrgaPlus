import { Avatar, Grid } from "@mui/material";
import { Stack } from "@mui/system";

import { ROLES } from "models/Rolle";
import { roleIcon } from "../../services/icons";
import CustomIcon from "../Misc/CustomIcon";

const RoleMenu = () => {
	const roles = ROLES.filter((r) => r.visible).sort((a, b) => a.order! - b.order!);

	const getRoles = (offset: number) => {
		let rows: any = [];

		for (let i = 0; i < 3; i++) {
			const role = roles[i + offset];
			if (role) {
				rows.push(<CustomIcon src={roleIcon(role.abbr)} />);
			}
		}

		return <Stack direction="row" justifyContent="space-around">{rows}</Stack>;
	};

	return (
		<Stack>
			{getRoles(0)}
			{getRoles(3)}
			{getRoles(6)}
		</Stack>
	);
};

export default RoleMenu;
