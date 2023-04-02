import { Avatar, Grid, Tooltip } from "@mui/material";
import { Stack } from "@mui/system";

import { Role, ROLES } from "models/Rolle";
import { roleIcon } from "../../services/icons";
import CustomIcon from "../Misc/CustomIcon";

interface RoleProps {
	onRolePick: (role: Role) => void;
}

const RoleMenu = (props: RoleProps) => {
	const roles = ROLES.filter((r) => r.visible).sort((a, b) => a.order! - b.order!);

	const getRoles = (offset: number) => {
		let rows: JSX.Element[] = [];

		for (let i = 0; i < 3; i++) {
			const role = roles[i + offset];
			if (role) {
				rows.push(<CustomIcon key={role.id} src={roleIcon(role.abbr)} tooltip={role.name} onClick={() => props.onRolePick(role)} />);
			}
		}

		return (
			<Stack direction="row" justifyContent="space-around">
				{rows}
			</Stack>
		);
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
