import { useState, useEffect } from "react";

import { ExpandLess } from "@mui/icons-material";
import { Button, Icon, Popper, Fade, Card, List, ListItem, ListItemText, css, Theme, IconButton, Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { Spieler, SpielerTermin } from "models/Spieler";
import { useRouteLoaderData } from "react-router-dom";
import { userRaid } from "models/Types";
import { SignUp } from "./SignUp";

const style = {
	spanContainer: css({
		display: "flex",
		marginRight: "8px",
		marginLeft: "4px",
	}),
	signUpCount: css({
		marginRight: "2px",
	}),
	signUpList: css({
		borderRadius: 0,
		marginRight: "8px",
	}),
	signUpListCard: css({
		borderRadius: 0,
	}),
};

interface SignUpListProps {
	signInList: (Spieler & SpielerTermin)[];
	archived?: boolean;
	onValueChange: (newValue: number | null, player: Spieler & SpielerTermin) => void;
}

const SignUpList = (props: SignUpListProps) => {
	const { signInList, archived, onValueChange } = props;

	const { role } = useRouteLoaderData("raidPage") as userRaid;
	const editable = role > 0 && !archived;

	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [popperWidth, setPopperWidth] = useState(0);

	const open = Boolean(anchorEl);

	const signUpIcon = (type: number) => {
		const icons = ["check_circle", "check_circle_outline", "cancel", "help"];
		return icons[type];
	};

	const signUpColor = (type: number) => {
		const colors = ["success", "warning", "error", "neutral"];
		return colors[type];
	};

	const signUpCount = () => {
		const yes = signInList.filter((s) => s.type === 0);
		const maybe = signInList.filter((s) => s.type === 1);
		const no = signInList.filter((s) => s.type === 2);
		return [yes, maybe, no];
	};

	const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (open) {
			setAnchorEl(null);
		} else {
			setAnchorEl(event.currentTarget);
		}
	};

	useEffect(() => {
		if (anchorEl) {
			setPopperWidth(anchorEl.clientWidth);
		}
	}, [anchorEl]);

	return (
		<>
			<Button
				color="neutral"
				variant="contained"
				onClick={handleButtonClick}
				disableRipple
				css={style.signUpList}>
				{signUpCount().map((s, i) => (
					<span key={i} css={style.spanContainer}>
						<span css={style.signUpCount}>{s.length}</span>
						<Icon color={signUpColor(i) as any}>{signUpIcon(i)}</Icon>
					</span>
				))}
				<ExpandLess sx={{ transition: "all 0.5s ease", transform: `rotate(${open ? 0 : "0.5turn"})` }} />
			</Button>
			<Popper open={open} anchorEl={anchorEl} placement="bottom-start" transition sx={{ width: popperWidth }}>
				{({ TransitionProps }) => (
					<Fade {...TransitionProps}>
						<Card css={style.signUpListCard}>
							<List>
								{signInList.map((s) => (
									<SignUpElements
										key={s.id}
										playerDate={s}
										editable={editable}
										color={signUpColor}
										icon={signUpIcon}
										onValueChange={onValueChange}
									/>
								))}
							</List>
						</Card>
					</Fade>
				)}
			</Popper>
		</>
	);
};

interface SignUpElementsProps {
	playerDate: Spieler & SpielerTermin;
	editable: boolean;
	color: (type: number) => string;
	icon: (type: number) => string;
	onValueChange: (newValue: number | null, player: Spieler & SpielerTermin) => void;
}

const SignUpElements = (props: SignUpElementsProps) => {
	const { playerDate, editable, color, icon, onValueChange } = props;
	const [edit, setEdit] = useState(false);

	const handleAnmeldungClick = () => {
		setEdit(true);
	};

	const handleValueChange = (newValue: number | null) => {
		onValueChange(newValue, playerDate);
		setEdit(false);
	}

	return edit ? (
		<Stack direction="row">
			<SignUp value={playerDate.type} onValueChange={handleValueChange} />
			<IconButton onClick={() => setEdit(false)}>
				<CloseIcon />
			</IconButton>
		</Stack>
	) : (
		<ListItem
			secondaryAction={
				editable ? (
					<IconButton onClick={handleAnmeldungClick}>
						<Icon color={color(playerDate.type) as any}>{icon(playerDate.type)}</Icon>
					</IconButton>
				) : (
					<Icon color={color(playerDate.type) as any}>{icon(playerDate.type)}</Icon>
				)
			}>
			<ListItemText primary={playerDate.name} />
		</ListItem>
	);
};

export default SignUpList;
