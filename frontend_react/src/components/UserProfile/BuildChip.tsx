/** @jsxImportSource @emotion/react */
import { Avatar, Chip, ChipProps, css, Fab, IconButton, Menu, MenuItem, Stack, styled } from "@mui/material";
import { yellow, grey } from "@mui/material/colors";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { classIcon, roleIcon } from "../../services/icons";
import { Build } from "models/Build";
import { Class } from "models/Klasse";
import CustomIcon from "../Misc/CustomIcon";
import { Role } from "models/Rolle";
import { useState } from "react";

interface IStyledChipProps extends ChipProps {
	cl?: Class;
}

const StyledChip = (props: IStyledChipProps) => {
	const { cl, ...other } = props;

	return (
		<Chip
			sx={[
				{ "& .MuiChip-label": { display: "none" }, margin: "4px" },
				cl != null && { backgroundColor: cl.color },
			]}
			{...other}
		/>
	);
};

interface IChipIconsProps {
	build: Build;
	showStar?: boolean;
	edit?: boolean;
	onRoleSelect?: (index: number | null) => void;
	onPrefChange?: (star: number) => void;
}

const ChipIcons = (props: IChipIconsProps) => {
	const { build, showStar, edit, onRoleSelect, onPrefChange } = props;

	const [selectedRole, setSelectedRole] = useState<number | null>(null);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const classSrc = classIcon(build.class.abbr);
	const roles = build.role != null ? build.role : ([{ id: 0, abbr: "" }] as Role[]);
	const imgProps = {
		sx: { height: 24, width: 24 },
	};

	const prefered = (star: number) => {
		let color = "";

		if (star === 0) {
			color = "#9E9E9E";
		} else if (star === 1) {
			color = yellow[900];
		} else if (star === 2) {
			color = grey[500];
		} else if (star === 3) {
			color = yellow[700];
		}

		return color;
	};

	const showStarIcon = () => {
		let star = null;

		if (showStar) {
			star =
				build.prefer > 0 ? (
					<StarIcon sx={{ marginLeft: 1, color: prefered(build.prefer) }} onClick={handlePrefMenuClick} />
				) : (
					<StarOutlineIcon sx={{ marginLeft: 1, color: prefered(build.prefer) }} onClick={handlePrefMenuClick} />
				);
		}

		return star;
	};

	const handlePrefMenuClick = (event: React.MouseEvent<any>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handlePrefChange = (star: number) => {
		if (onPrefChange) {
			onPrefChange(star);
			setAnchorEl(null);
		}
	}

	const handleRoleSelect = (index: number) => {
		if (edit && onRoleSelect) {
			let newIndex: number | null = null;

			if (selectedRole == null || selectedRole !== index) {
				newIndex = index;
			} else {
				newIndex = null;
			}

			setSelectedRole(newIndex);
			onRoleSelect(newIndex);
		}
	};

	return (
		<Stack direction="row" alignItems="center" sx={{ paddingLeft: 1.5, paddingRight: 1.5 }}>
			<CustomIcon src={classSrc} sx={{ width: 28, height: 28, marginRight: 0.5 }} tooltip={build.class.name} />
			{roles.map((r, i) => (
				<CustomIcon
					src={roleIcon(r.abbr)}
					sx={[
						{ width: 28, height: 28 },
						i === selectedRole && { backgroundColor: "#444", borderRadius: "10px" },
					]}
					key={r.id + "-" + i}
					imgProps={{ height: 24, width: 24 }}
					tooltip={r.name}
					onClick={() => handleRoleSelect(i)}
				/>
			))}
			{showStarIcon()}
			<Menu id="preference-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
				<MenuItem>
					<StarOutlineIcon sx={{ color: prefered(0) }} onClick={() => handlePrefChange(0)} />
				</MenuItem>
				{[1, 2, 3].map((star) => (
					<MenuItem key={star}>
						<StarIcon sx={{ color: prefered(star) }} onClick={() => handlePrefChange(star)} />
					</MenuItem>
				))}
			</Menu>
		</Stack>
	);
};

interface IProps {
	build: Build;
	ownProfile?: boolean;
	star?: boolean;
	edit?: boolean;
	onDelete?: () => void;
	onRoleSizeChange?: (type: "add" | "remove") => void;
	onRoleSelect?: (index: number | null) => void;
	onPrefChange?: (star: number) => void;
}

const BuildChip = (props: IProps) => {
	const { build, ownProfile, star, edit, onDelete, onRoleSizeChange, onRoleSelect, onPrefChange } = props;

	let buildChip = null;

	if (ownProfile) {
		buildChip = (
			<StyledChip
				avatar={<ChipIcons build={build} showStar={star} edit={edit} onRoleSelect={onRoleSelect} onPrefChange={onPrefChange} />}
				onDelete={onDelete}
			/>
		);
	} else {
		buildChip = (
			<StyledChip avatar={<ChipIcons build={build} showStar={star} edit={edit} onRoleSelect={onRoleSelect} />} />
		);
	}

	const roles = build.role != null && build.role.length > 0 ? build.role : ([{ id: 0 }] as Role[]);

	const handleClick = (type: "add" | "remove") => {
		if (onRoleSizeChange) {
			onRoleSizeChange(type);
		}
	};

	return (
		<>
			{buildChip}
			{edit ? (
				<Stack direction="row">
					{roles.length < 4 ? (
						<Fab
							color="success"
							sx={{ height: 24, width: 24, minHeight: 24, margin: "auto" }}
							onClick={() => handleClick("add")}>
							<AddIcon />
						</Fab>
					) : null}
					{roles.length > 1 ? (
						<Fab
							color="error"
							sx={{ height: 24, width: 24, minHeight: 24, margin: "auto 4px" }}
							onClick={() => handleClick("remove")}>
							<RemoveIcon />
						</Fab>
					) : null}
				</Stack>
			) : null}
		</>
	);
};

export default BuildChip;
