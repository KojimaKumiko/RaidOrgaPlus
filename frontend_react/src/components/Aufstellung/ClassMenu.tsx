import * as React from "react";
import { Fragment, useState } from "react";
import { Avatar, Grid, Menu, MenuItem, Stack } from "@mui/material";
import { CLASSES } from "models/Klasse";
import { classIcon } from "../../services/icons";
import CustomIcon from "../Misc/CustomIcon";

const ClassMenu = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [baseClassId, setBaseClassId] = useState(0);
	const open = Boolean(anchorEl);

	const baseClasses = CLASSES.filter((c) => c.isBase);

	const handleClick = (event: React.MouseEvent<HTMLElement>, baseClassId: number) => {
		setAnchorEl(event.currentTarget);
		setBaseClassId(baseClassId);
	}

	const handleClose = () => {
		setAnchorEl(null);
	}

	const getSpecs = (baseId: number) => {
		const specs = CLASSES.filter(c => c.fk_base === baseId);

		return specs.map(s => <MenuItem key={s.name}><CustomIcon src={classIcon(s.abbr)}/></MenuItem>);
	}

	const getBaseClasses = (offset: number) => {
		let rows: any = [];

		for (let i = 0; i < 3; i++) {
			const baseClass = baseClasses[i + offset];
			if (baseClass) {
				rows.push(
					<React.Fragment key={baseClass.name}>
						<CustomIcon
							src={classIcon(baseClass.abbr)}
							onClick={(e) => handleClick(e, baseClass.id)}
						/>
					</React.Fragment>
				);
			}
		}

		return <Stack direction="row" justifyContent="space-around">{rows}</Stack>;
	};

	return (
		<Stack>
			{getBaseClasses(0)}
			{getBaseClasses(3)}
			{getBaseClasses(6)}
			<Menu
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				MenuListProps={{
					onMouseLeave: handleClose,
					sx: { display: "flex", "& .MuiMenuItem-root": { paddingLeft: 1, paddingRight: 1 } },
				}}
				anchorOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}>
				{getSpecs(baseClassId)}
			</Menu>
		</Stack>
	);
};

export default ClassMenu;
