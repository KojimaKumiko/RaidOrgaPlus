import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

import { Box, Fab, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { CompPageLoader, CompPlayer } from "../../models/types";
import PlayerName from "../Misc/PlayerName";
import { Spieler, SpielerTermin } from "models/Spieler";
import { element } from "models/Types";
import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { setClass, setName, setRole } from "../../services/endpoints/aufstellungen";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
	addElement,
	selectElements,
	selectSignUps,
	setName as pickName,
	clearName,
	setClass as pickClass,
	setRole as pickRole,
	addRole,
	removeRole,
	selectShowExtraRoles,
} from "../../store/slices/terminSlice";
import { classIcon, miscIcon, roleIcon } from "../../services/icons";
import CustomIcon from "../Misc/CustomIcon";
import ClassMenu from "./ClassMenu";
import { CLASSES, Class } from "models/Klasse";
import RoleMenu from "./RoleMenu";
import { Role } from "models/Rolle";
import { selectLoggedInUser } from "../../store/slices/userSlice";

interface CompElementProps {
	edit: boolean;
	composition: Aufstellung & Encounter;
	position: number;
}

const getClassIcon = (classAbbr: string) => {
	if (classAbbr && classAbbr.trim() != null) {
		return classIcon(classAbbr);
	}
	return miscIcon("empty");
};

const getClassTooltip = (classAbbr: string) => {
	if (classAbbr && classAbbr.trim() != null) {
		return CLASSES.filter(c => c.abbr == classAbbr)[0].name;
	}
	return "";
}

const getRoleIcon = (role: Role) => {
	if (role && role.abbr) {
		return roleIcon(role.abbr);
	}
	return miscIcon("empty");
};

const getRoleTooltip = (role: Role) => {
	if (role && role.abbr) {
		return role.name;
	}
	return "";
}

const CompElement = (props: CompElementProps) => {
	const { edit, composition, position } = props;

	const dispatch = useAppDispatch();
	const signUps = useAppSelector(selectSignUps);
	const elements = useAppSelector(selectElements);
	const loggedInUser = useAppSelector(selectLoggedInUser);
	const showExtraRoles = useAppSelector(selectShowExtraRoles);

	const getElement = (): element => {
		const element = elements.find((e) => e.aufstellung === composition.id && e.pos === position);
		if (element) {
			return element;
		}

		return {
			aufstellung: composition.id,
			// pos: position,
			pos: position,
			class: "",
			role: "",
			name: "???",
			accname: "???",
			id: 0,
			roles: [],
		} as unknown as element;
	};

	const getElementClass = () => {
		const element = getElement();
		return element.class;
	};

	const getElementRoles = () => {
		const element = getElement();
		if (element.roles && element.roles.length > 0) {
			return element.roles;
		}
		return [{ id: 0 }] as Role[];
	};

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = async (player: CompPlayer) => {
		handleClose();
		dispatch(pickName({ compId: composition.id, position, user: player }));
		await setName(composition.id, position, player.id);
	};

	const getMenuItems = () => {
		const lfgUser = {
			id: 1,
			accname: "LFG",
			name: "LFG",
		};
		let signedUp: CompPlayer[] = signUps
			.filter((s) => s.type < 2)
			.map((s) => ({ id: s.id, name: s.name, accname: s.accname }));
		signedUp.push(lfgUser);
		// TODO: add substitue players.
		return signedUp.map((s) => {
			return (
				<MenuItem key={s.id} onClick={() => handleClick(s)}>
					{s.name}
				</MenuItem>
			);
		});
	};

	const getUser = (): Spieler => {
		const element = getElement();

		return {
			id: element.id,
			accname: element.accname,
			name: element.name,
		} as Spieler;
	};

	const handlePickPlayer = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const onClearName = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		dispatch(clearName({ compId: composition.id, position }));
		await setName(composition.id, position, 0);
	};

	const highlightSelf = () => {
		const element = getElement();
		if (element.id == 0 || !loggedInUser) {
			return false;
		}
		return element.accname === loggedInUser.accname;
	};

	const doublePlayer = () => {
		const element = getElement();
		if (element.id <= 1 || !element.name) {
			return false;
		}
		return elements.filter((e) => e.aufstellung == composition.id && e.accname == element.accname).length > 1;
	};

	return (
		<Stack
			direction="column"
			sx={[
				highlightSelf() && { borderRadius: "10px", backgroundColor: "#444444" },
				doublePlayer() && {
					borderStyle: "solid",
					borderRadius: "10px",
					borderWidth: "1px",
					borderColor: "red",
					margin: "-1px",
				},
			]}>
			<Box width={240} sx={{ paddingLeft: "5px" }}>
				{edit ? (
					<span onClick={handlePickPlayer} onContextMenu={onClearName} style={{ cursor: "pointer" }}>
						<span>{getUser().name}</span>
					</span>
				) : (
					<PlayerName user={getUser()} clickable />
				)}
			</Box>
			{edit ? (
				<Box width={160} display="flex" sx={{ paddingLeft: "5px" }}>
					<ClassSelection compId={composition.id} position={position} classAbbr={getElementClass()} />
					<RoleSelection compId={composition.id} position={position} roles={getElementRoles()} />
					<ExtraRoles
						visible={showExtraRoles}
						compId={composition.id}
						position={position}
						roles={getElementRoles()}
					/>
				</Box>
			) : (
				<Box width={160} display="flex" sx={{ paddingLeft: "5px" }}>
					<CustomIcon
						src={getClassIcon(getElementClass())}
						imgProps={{ width: 20, height: 20 }}
						sx={{ width: 20, height: 20, mb: 1, mr: 1, borderRadius: "inherit" }}
						tooltip={getClassTooltip(getElementClass())}
					/>
					{getElementRoles().map((r, idx) => (
						<CustomIcon
							src={getRoleIcon(r)}
							key={idx + "_" + r.id}
							imgProps={{ width: 20, height: 20 }}
							sx={{ width: 20, height: 20, borderRadius: "inherit", mr: 1 }}
							tooltip={getRoleTooltip(r)}
						/>
					))}
				</Box>
			)}
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				{getMenuItems()}
			</Menu>
		</Stack>
	);
};

const ClassSelection = ({ compId, position, classAbbr }: { compId: number; position: number; classAbbr: string }) => {
	const dispatch = useAppDispatch();

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClearClass = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		dispatch(pickClass({ compId, position, cls: { name: "", id: 0, abbr: "" } as Class }));
		await setClass(compId, position, 0);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClassPick = async (specilization: Class) => {
		handleClose();
		dispatch(pickClass({ compId, position, cls: specilization }));
		await setClass(compId, position, specilization.id);
	};

	return (
		<>
			<CustomIcon
				src={getClassIcon(classAbbr)}
				onClick={handleClick}
				onContextMenu={handleClearClass}
				imgProps={{ width: 20, height: 20 }}
				sx={{ width: 20, height: 20, mb: 1, mr: 1, cursor: "pointer", borderRadius: "inherit" }}
				tooltip={getClassTooltip(classAbbr)}
			/>
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				<MenuItem>
					<ClassMenu onClassPick={handleClassPick} />
				</MenuItem>
			</Menu>
		</>
	);
};

const RoleSelection = ({ compId, position, roles }: { compId: number; position: number; roles: Role[] }) => {
	const dispatch = useAppDispatch();

	const [index, setIndex] = useState<number | null>(null);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>, idx: number) => {
		setAnchorEl(event.currentTarget);
		setIndex(idx);
	};

	const handleClearRole = async (event: React.MouseEvent<HTMLElement>, idx: number) => {
		event.preventDefault();
		const role = { id: 0 } as Role;

		dispatch(pickRole({ compId, position, role, index: idx }));
		const newRoles = roles.map((r) => r.id);
		newRoles[idx] = role.id;
		await setRole(compId, position, newRoles.join(", "));
	};

	const handleClose = () => {
		setAnchorEl(null);
		setIndex(null);
	};

	const handleRolePick = async (role: Role) => {
		setAnchorEl(null);

		if (index == null) {
			// should in theory not happen.
			console.log("Index for role pick was null.");
			return;
		}

		dispatch(pickRole({ compId, position, role, index }));
		const newRoles = roles.map((r) => r.id);
		newRoles[index] = role.id;
		await setRole(compId, position, newRoles.join(", "));

		setIndex(null);
	};

	return (
		<>
			{roles.map((r, idx) => (
				<CustomIcon
					src={getRoleIcon(r)}
					onClick={(e) => handleClick(e, idx)}
					onContextMenu={(e) => handleClearRole(e, idx)}
					key={idx + "_" + r.id}
					imgProps={{ width: 20, height: 20 }}
					sx={{ width: 20, height: 20, cursor: "pointer", borderRadius: "inherit", mr: 1 }}
					tooltip={getRoleTooltip(r)}
				/>
			))}
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				<MenuItem>
					<RoleMenu onRolePick={handleRolePick} />
				</MenuItem>
			</Menu>
		</>
	);
};

const ExtraRoles = ({
	visible,
	compId,
	position,
	roles,
}: {
	visible: boolean;
	compId: number;
	position: number;
	roles: Role[];
}) => {
	const dispatch = useAppDispatch();

	const showAddButton = roles.length <= 3;
	const showRemoveButton = roles.length >= 2;

	const handleAddRole = async () => {
		dispatch(addRole({ compId, position }));
		const newRoles = roles.map((r) => r.id);
		newRoles.push(0);
		await setRole(compId, position, newRoles.join(", "));
	};

	const handleRemoveRole = async () => {
		dispatch(removeRole({ compId, position }));
		const newRoles = roles.map((r) => r.id);
		newRoles.pop();
		await setRole(compId, position, newRoles.join(", "));
	};

	return (
		<Stack direction="row" sx={[!visible && { display: "none" }]}>
			<Fab
				size="small"
				sx={[
					{ width: 20, minWidth: 20, height: 20, minHeight: 20, mr: 1 },
					!showAddButton && { display: "none" },
				]}
				color="success"
				onClick={handleAddRole}>
				<AddIcon sx={{ color: "white" }} />
			</Fab>
			<Fab
				sx={[
					{ width: 20, minWidth: 20, height: 20, minHeight: 20, mr: 1 },
					!showRemoveButton && { display: "none" },
				]}
				color="error"
				onClick={handleRemoveRole}>
				<RemoveIcon />
			</Fab>
		</Stack>
	);
};

export default CompElement;
