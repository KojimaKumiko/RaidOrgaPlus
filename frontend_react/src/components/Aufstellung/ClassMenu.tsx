import * as React from "react";
import { Fragment, useEffect, useState } from "react";
import { Avatar, Grid, Menu, MenuItem, Stack, Tooltip, Zoom } from "@mui/material";
import { debounce } from "debounce";
import whatInput from "what-input";

import { Class, CLASSES } from "models/Klasse";
import { classIcon } from "../../services/icons";
import CustomIcon from "../Misc/CustomIcon";

interface ClassProps {
	onClassPick: (specilization: Class) => void;
}

const ClassMenu = (props: ClassProps) => {
	const [isTouch, setIsTouch] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [baseClassId, setBaseClassId] = useState(0);
	const open = Boolean(anchorEl);

	const baseClasses = CLASSES.filter((c) => c.isBase);

	useEffect(() => {
		setIsTouch(whatInput.ask() === "touch");
	}, []);

	const handleSpecClick = (specilization: Class) => {
		setAnchorEl(null);
		props.onClassPick(specilization);
	};

	const getSpecs = (baseId: number) => {
		const specs = CLASSES.filter((c) => c.fk_base === baseId);

		return specs.map((s) => (
			<Tooltip title={s.name} arrow key={s.name} TransitionComponent={Zoom} disableInteractive>
				<MenuItem>
					<CustomIcon src={classIcon(s.abbr)} onClick={() => handleSpecClick(s)} sx={{ borderRadius: "inherit" }} />
				</MenuItem>
			</Tooltip>
		));
	};

	const debouncedHandler = debounce(
		(target: EventTarget & HTMLElement, baseClassId: number) => handleBaseClick(target, baseClassId),
		200
	);

	const handleBaseClick = (target: EventTarget & HTMLElement, baseClassId: number) => {
		setAnchorEl(target);
		setBaseClassId(baseClassId);
	};

	const handleLeave = () => {
		debouncedHandler.clear();
	};

	const handleClose = () => {
		setAnchorEl(null);
		debouncedHandler.clear();
	};

	const getBaseClasses = (offset: number) => {
		let rows: JSX.Element[] = [];

		for (let i = 0; i < 3; i++) {
			const baseClass = baseClasses[i + offset];
			let icon: JSX.Element;

			if (isTouch) {
				icon = (
					<CustomIcon
						src={classIcon(baseClass.abbr)}
						onClick={(e) => handleBaseClick(e.currentTarget, baseClass.id)}
						disableInteractive
					/>
				);
			} else {
				icon = (
					<CustomIcon
						src={classIcon(baseClass.abbr)}
						onMouseEnter={(e) => debouncedHandler(e.currentTarget, baseClass.id)}
						onMouseLeave={handleLeave}
						disableInteractive
					/>
				);
			}

			rows.push(<React.Fragment key={baseClass.name}>{icon}</React.Fragment>);
		}

		return (
			<Stack direction="row" justifyContent="space-around">
				{rows}
			</Stack>
		);
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
					sx: {
						display: "flex",
						"& .MuiMenuItem-root": { paddingLeft: 0.75, paddingRight: 0.75 },
						marginLeft: 1,
						marginRight: 1,
					},
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
