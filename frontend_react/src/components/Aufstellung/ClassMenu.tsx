import { Avatar, Grid, Stack } from "@mui/material";
import { CLASSES } from "models/Klasse";
import { classIcon } from "../../services/icons";

const ClassMenu = () => {
	const baseClasses = CLASSES.filter((c) => c.isBase);
	const imgProps = {
		sx: { height: 24, width: 24 },
	};

	const getClasses = (offset: number) => {
		let rows: any = [];

		for (let i = 0; i < 3; i++) {
			const baseClass = baseClasses[i + offset];
			if (baseClass) {
				rows.push(
					<Avatar src={classIcon(baseClass.abbr)} imgProps={imgProps} sx={{ width: 24 }} />
				);
			}
		}

		return <Stack direction="row">{rows}</Stack>;
	};

	return (
		<Stack>
			{getClasses(0)}
			{getClasses(3)}
			{getClasses(6)}
		</Stack>
	);
};

export default ClassMenu;
