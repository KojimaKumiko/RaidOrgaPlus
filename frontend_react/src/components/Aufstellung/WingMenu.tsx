import { useState } from "react";

import { Menu, MenuItem } from "@mui/material";
import { Encounter } from "models/Encounter";

const wingNames = [
	"W1 | Spirit Vale",
	"W2 | Salvation Pass",
	"W3 | Stronghold of the Faithful",
	"W4 | Bastion of the Penitent",
	"W5 | Hall of Chains",
	"W6 | Mythwright Gambit",
	"W7 | The Key of Ahdashim",
	"Strike 1 | Icebrood Saga",
	"Strike 2 | End of Dragons",
	"Strike 3 | Secrets of the Obscure"
];

export type WingMenuProps = {
	anchorEl: HTMLElement | null;
	onClose: () => void;
	wings: Encounter[][];
	strikes: Encounter[][];
	onClick: (encounter: Encounter) => void;
};

const WingMenu = (props: WingMenuProps) => {
	const { anchorEl, onClose, wings, strikes, onClick } = props;
	const open = Boolean(anchorEl);

	const [innerAnchorEl, setInnerAnchorEl] = useState<HTMLElement | null>(null);
	const [openElem, setOpenElem] = useState<number | null>(null);

	const handleClick = (elem: number) => (event: React.MouseEvent<HTMLElement>) => {
		setInnerAnchorEl(event.currentTarget);
		setOpenElem(elem);
	};

	const handleClose = () => {
		setInnerAnchorEl(null);
		setOpenElem(null);
	};

	const getWingMenuItems = () => {
		const wingElements = wings.map((w, i) => (
			<MenuItem key={w[0].id} onClick={handleClick(i)}>
				{wingNames[i]}
			</MenuItem>
		));

		const strikeElements = strikes.map((s, i) => (
			<MenuItem key={s[0].id} onClick={handleClick(i + wings.length)}>
				{wingNames[i + wings.length]}
			</MenuItem>
		));

		return [...wingElements, ...strikeElements];
	};

	return (
		<>
			<Menu anchorEl={anchorEl} open={open} onClose={onClose}>
				{getWingMenuItems()}
			</Menu>
			{[...wings, ...strikes].map((e, i) => (
				<BossMenu
					key={e[0].id}
					encounters={e}
					open={openElem === i}
					anchorEl={innerAnchorEl}
					onClose={handleClose}
					onClick={onClick}
					showFullClear
				/>
			))}
		</>
	);
};

export type BossMenuProps = {
	encounters: Encounter[];
	showFullClear: boolean;
	anchorEl: HTMLElement | null;
	open: boolean;
	onClose: () => void;
	onClick: (encounter: Encounter) => void;
};

const BossMenu = (props: BossMenuProps) => {
	const { encounters, showFullClear, anchorEl, open, onClose, onClick } = props;

	const getBosses = () => {
		if (showFullClear) {
			let fc = { id: 0, name: "Full Clear", wing: 0, strike: 0 } as Encounter;
			const enc = encounters[0];
			if (enc.wing != null) {
				fc.wing = enc.wing;
			} else {
				fc.strike = enc.strike;
			}

			return [fc, ...encounters];
		} else {
			return encounters;
		}
	};

	const getBossMenuItems = () => {
		const enc = getBosses();
		const result = enc.map((b, i) => <MenuItem key={i} onClick={() => onClick(b)}>{b.name}</MenuItem>);

		return result;
	};

	return (
		<Menu open={open} anchorEl={anchorEl} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
			{getBossMenuItems()}
		</Menu>
	);
};

export default WingMenu;
