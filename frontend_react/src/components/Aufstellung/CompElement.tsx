import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

import { Box, Menu, MenuItem, Stack } from "@mui/material";

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
} from "../../store/slices/terminSlice";
import { classIcon, miscIcon, roleIcon } from "../../services/icons";
import CustomIcon from "../Misc/CustomIcon";
import ClassMenu from "./ClassMenu";
import { Class } from "models/Klasse";
import RoleMenu from "./RoleMenu";
import { Role } from "models/Rolle";

interface CompElementProps {
	edit: boolean;
	composition: Aufstellung & Encounter;
	position: number;
}

const CompElement = (props: CompElementProps) => {
	const { edit, composition, position } = props;

	const dispatch = useAppDispatch();
	const signUps = useAppSelector(selectSignUps);
	const elements = useAppSelector(selectElements);

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

	return (
		<Stack direction="column">
			<Box width={240}>
				{edit ? (
					<span onClick={handlePickPlayer} onContextMenu={onClearName}>
						{/* <PlayerName user={getUser()} /> */}
						<span>{getUser().name}</span>
					</span>
				) : (
					<PlayerName user={getUser()} clickable />
				)}
			</Box>
			<Box width={160} display="flex">
				<ClassSelection compId={composition.id} position={position} classAbbr={getElementClass()} />
				<RoleSelection compId={composition.id} position={position} roles={getElementRoles()} />
			</Box>
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

	const getSrc = () => {
		if (classAbbr && classAbbr.trim() != null) {
			return classIcon(classAbbr);
		}
		return miscIcon("empty");
	};

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
			<CustomIcon src={getSrc()} onClick={handleClick} onContextMenu={handleClearClass} />
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

	const getSrc = (role: Role) => {
		if (role && role.abbr) {
			return roleIcon(role.abbr);
		}
		return miscIcon("empty");
	};

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
					src={getSrc(r)}
					onClick={(e) => handleClick(e, idx)}
					onContextMenu={(e) => handleClearRole(e, idx)}
					key={idx + "_" + r.id}
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

export default CompElement;
