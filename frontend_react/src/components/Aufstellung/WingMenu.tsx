import { useState } from "react";

import { Menu, MenuItem } from "@mui/material";
import { Encounter } from "models/Encounter";

export type WingMenuProps = {
	anchorEl: HTMLElement | null;
	onClose: () => void;
	wings: Encounter[][];
	strikes: Encounter[][];
};

const WingMenu = (props: WingMenuProps) => {
	const { anchorEl, onClose, wings, strikes } = props;
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
				Wing {i + 1}
			</MenuItem>
		));

		const strikeElements = strikes.map((s, i) => (
			<MenuItem key={s[0].id} onClick={handleClick(i + wings.length)}>
				Strike {i + 1}
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
					showFullClear
				/>
			))}
			{/* Maybe use only one Menu and generate the MenuItems dynamically based on which item was clicked... */}
		</>
	);
};

export type BossMenuProps = {
	encounters: Encounter[];
	showFullClear: boolean;
	anchorEl: HTMLElement | null;
	open: boolean;
	onClose: () => void;
};

const BossMenu = (props: BossMenuProps) => {
	const { encounters, showFullClear, anchorEl, open, onClose } = props;

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
		const result = enc.map((b, i) => <MenuItem key={i}>{b.name}</MenuItem>);

		return result;
	};

	return (
		<Menu open={open} anchorEl={anchorEl} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
			{getBossMenuItems()}
		</Menu>
	);
};

export default WingMenu;
