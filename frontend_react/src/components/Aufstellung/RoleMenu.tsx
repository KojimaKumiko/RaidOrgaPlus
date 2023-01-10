import { Avatar, Grid } from "@mui/material";
import { Stack } from "@mui/system";

import { ROLES } from "models/Rolle";
import { roleIcon } from "../../services/icons";

const RoleMenu = () => {
	const roles = ROLES.filter((r) => r.visible);
	const imgProps = {
		sx: { height: 24, width: 24 },
	};

	const getRoles = (offset: number) => {
		let rows: any = [];

		for (let i = 0; i < 3; i++) {
			const role = roles[i + offset];
			if (role) {
				rows.push(<Avatar src={roleIcon(role.abbr)} imgProps={imgProps} sx={{ width: 24 }} />);
			}
		}

		return <Stack direction="row">{rows}</Stack>;
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
