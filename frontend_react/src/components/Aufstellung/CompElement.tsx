import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

import { Box, Menu, MenuItem } from "@mui/material";

import { CompPageLoader } from "../../models/types";
import PlayerName from "../Misc/PlayerName";
import { Spieler, SpielerTermin } from "models/Spieler";
import { element } from "models/Types";
import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { setName } from "../../services/endpoints/aufstellungen";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addElement, selectElements, selectSignUps } from "../../store/slices/terminSlice";

interface CompElementProps {
	edit: boolean;
	composition: Aufstellung & Encounter;
	position: number;
}

interface MenuPlayer {
	id: number;
	accname: string;
	name: string;
}

const CompElement = (props: CompElementProps) => {
	const { edit, composition, position } = props;

	const dispatch = useAppDispatch();
	const signUps = useAppSelector(selectSignUps);
	const elements = useAppSelector(selectElements);

	const getElement = (): element => {
		const element = elements.find(e => e.aufstellung === composition.id && e.pos === position);
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

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = async (player: MenuPlayer) => {
		handleClose();
		const element = getElement();
		element.id = player.id;
		element.accname = player.accname;
		element.name = player.name;
		await setName(composition.id, position, player.id);
		dispatch(addElement(element));
	};

	const getMenuItems = () => {
		const lfgUser = {
			id: 1,
			accname: "LFG",
			name: "LFG",
		};
		let signedUp: MenuPlayer[] = signUps
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

	const clearName = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const element = getElement();
		element.id = 0;
		element.accname = "???";
		element.name = "???";
		await setName(composition.id, position, 0);
	}

	return (
		<Box>
			{edit ? (
				<span onClick={handlePickPlayer} onContextMenu={clearName}>
					{/* <PlayerName user={getUser()} /> */}
					<span>{getUser().name}</span>
				</span>
			) : <PlayerName user={getUser()} clickable />}
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				{getMenuItems()}
			</Menu>
		</Box>
	);
};

export default CompElement;
