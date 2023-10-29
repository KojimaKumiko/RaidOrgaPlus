/** @jsxImportSource @emotion/react */
import { Fragment, useEffect, useState } from "react";
import { useRevalidator, useRouteLoaderData } from "react-router-dom";

import { Box, IconButton, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Tooltip, css } from "@mui/material";
import { Theme } from "@emotion/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ShareIcon from "@mui/icons-material/Share";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";

import { CompPageLoader } from "../../models/types";
import { anmelden } from "../../services/endpoints/termine";
import SignUpList from "./SignUpList";
import { Encounter } from "models/Encounter";
import { listEncounterGrouped, listEncounterGroupedStrikes } from "../../services/endpoints/gamedata";
import WingMenu from "./WingMenu";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../../store/slices/userSlice";

const style = {
	headline: css({
		marginRight: "12px",
		fontSize: 20,
		fontWeight: "bold",
	}),
	toggleButtonBorderRadius: css({
		borderRadius: 24,
	}),
	toggleButton: (theme: Theme) =>
		css({
			borderColor: "hsla(0,0%,100%,.12) !important",
			backgroundColor: theme.palette.neutral.main,
		}),
	container: css({
		margin: 16,
	}),
};

const Toolbar = () => {
	const { termin, signUpPlayer, signUps } = useRouteLoaderData("compPage") as CompPageLoader;
	const revalidator = useRevalidator();
	const loggedInUser = useSelector(selectLoggedInUser);

	const [signUpValue, setSignUpValue] = useState<number | null>(signUpPlayer);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const [wings, setWings] = useState<Encounter[][]>([]);
	const [strikes, setStrikes] = useState<Encounter[][]>([]);

	useEffect(() => {
		const fetchData = async () => {
			setWings(await listEncounterGrouped());
			setStrikes(await listEncounterGroupedStrikes());
		};

		fetchData().catch(console.error);
	}, []);

	const getHeadline = () => {
		let headline = termin.dateString + " " + termin.time;
		if (termin.endtime) {
			headline += " - " + termin.endtime;
		}

		return headline;
	};

	const handleSignUpValueChange = async (newValue: number | null) => {
		if (newValue != null) {
			setSignUpValue(newValue);
			
			let signUp = signUps.find(s => s.id === loggedInUser?.id)
			if (signUp) {
				signUp.type = newValue;
			}

			await anmelden(termin.id, newValue);
		}
	};

	const handleRefresh = () => {
		revalidator.revalidate(); // a fancy way of refreshing aka the loader of the route gets re-triggered.
	};

	const handleAddBoss = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box css={style.container}>
			<Stack direction="row" justifyContent="space-between">
				<Stack direction="row" alignItems="center">
					<span css={style.headline}>{getHeadline()}</span>
					<SignUp value={signUpValue} onValueChange={handleSignUpValueChange} />
				</Stack>
				<SignUpList signInList={signUps} />
			</Stack>
			<Stack direction="row">
				<Tooltip title="Refresh">
					<IconButton onClick={handleRefresh}>
						<RefreshIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Bosse hinzufügen">
					<IconButton onClick={handleAddBoss}>
						<AddIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Ersatzspieler">
					<IconButton>
						<PermIdentityIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Aufstellung teilen">
					<IconButton>
						<ShareIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Termin archivieren">
					<IconButton>
						<SendIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Termin löschen">
					<IconButton color="error">
						<ClearIcon />
					</IconButton>
				</Tooltip>
			</Stack>
			<WingMenu anchorEl={anchorEl} wings={wings} strikes={strikes} onClose={handleClose} />
		</Box>
	);
};

export type SignUpProps = {
	value: number | null;
	onValueChange: (newValue: number | null) => void;
};

const SignUp = (props: SignUpProps) => {
	const { value, onValueChange } = props;

	return (
		<ToggleButtonGroup value={value} exclusive onChange={(e, v) => onValueChange(v)}>
			<ToggleButton value={0} css={[style.toggleButton, style.toggleButtonBorderRadius]}>
				<CheckCircleIcon color="success" />
			</ToggleButton>
			<ToggleButton value={1} css={style.toggleButton}>
				<CheckCircleOutlineIcon color="warning" />
			</ToggleButton>
			<ToggleButton value={2} css={[style.toggleButton, style.toggleButtonBorderRadius]}>
				<CancelIcon color="error" />
			</ToggleButton>
		</ToggleButtonGroup>
	);
};

export default Toolbar;
