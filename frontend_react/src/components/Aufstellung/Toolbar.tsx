import { Fragment, useEffect, useState } from "react";
import { useRevalidator, useRouteLoaderData } from "react-router-dom";

import { Box, FormControlLabel, IconButton, Stack, Switch, Tooltip, css } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ShareIcon from "@mui/icons-material/Share";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { CompPageLoader } from "../../models/types";
import { anmelden, anmeldenLead } from "../../services/endpoints/termine";
import SignUpList from "./SignUpList";
import { Encounter } from "models/Encounter";
import { listEncounterGrouped, listEncounterGroupedStrikes } from "../../services/endpoints/gamedata";
import WingMenu from "./WingMenu";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
	selectSignUpPlayer,
	selectSignUps,
	selectTermin,
	setShowExtraRoles,
	setSignUpPlayer,
	updateSignUps,
} from "../../store/slices/terminSlice";
import { selectLoggedInUser } from "../../store/slices/userSlice";
import { Spieler, SpielerTermin } from "models/Spieler";
import { SignUp } from "./SignUp";

export const style = {
	headline: css({
		marginRight: 12,
		fontSize: 20,
		fontWeight: "bold",
	}),
	container: css({
		margin: 16,
	}),
	actionRow: css({
		marginTop: 8,
	}),
};

interface ToolbarProps {
	onEncounterClick: (encounter: Encounter) => void;
	onRefresh: () => void;
	isArchived?: boolean;
}

const Toolbar = (props: ToolbarProps) => {
	const { onEncounterClick, onRefresh, isArchived } = props;

	const dispatch = useAppDispatch();

	const termin = useAppSelector(selectTermin)!;
	const signUps = useAppSelector(selectSignUps);
	const signUpPlayer = useAppSelector(selectSignUpPlayer);
	const loggedInUser = useAppSelector(selectLoggedInUser);
	const revalidator = useRevalidator();

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
		if (termin == null) {
			return "";
		}

		let headline = termin.dateString + " " + termin.time;
		if (termin.endtime) {
			headline += " - " + termin.endtime;
		}

		return headline;
	};

	const handleSignUpValueChange = async (newValue: number | null) => {
		if (newValue != null) {
			dispatch(setSignUpPlayer(newValue));
			const signUp = { ...loggedInUser, type: newValue } as Spieler & SpielerTermin;
			dispatch(updateSignUps(signUp));

			await anmelden(termin.id, newValue);
		}
	};

	const handleSignUpListValueChange = async (newValue: number | null, player: Spieler & SpielerTermin) => {
		if (newValue != null) {
			const signUp = { ...player, type: newValue };
			dispatch(updateSignUps(signUp));

			await anmeldenLead(player.id, termin.id, newValue);
		}
	};

	// const handleRefresh = () => {
	// 	revalidator.revalidate(); // a fancy way of refreshing aka the loader of the route gets re-triggered.
	// };

	const handleAddBoss = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleEncounterClick = (encounter: Encounter) => {
		handleClose();
		onEncounterClick(encounter);
	};

	const handleExtraRolesChanged = (value: boolean) => {
		dispatch(setShowExtraRoles(value));
	};

	return (
		<Box css={style.container}>
			<Stack direction="row" justifyContent="space-between">
				<Stack direction="row" alignItems="center" sx={{ height: "50px" }}>
					<span css={style.headline}>{getHeadline()}</span>
					{/* <SignUp value={signUpPlayer} onValueChange={handleSignUpValueChange} /> */}
					{!isArchived ? <SignUp value={signUpPlayer} onValueChange={handleSignUpValueChange} /> : null}
				</Stack>
				<SignUpList signInList={signUps} onValueChange={handleSignUpListValueChange} />
			</Stack>
			<Stack direction="row" css={style.actionRow}>
				{!isArchived ? (
					<>
						<Tooltip title="Refresh">
							<IconButton onClick={onRefresh}>
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
						<Tooltip title="Buttons zum Hinzufügen bzw. Entfernen von extra Rollen Ein-/Auschalten">
							<FormControlLabel
								control={
									<Switch
										onChange={(e) => handleExtraRolesChanged(e.target.checked)}
										sx={{ ml: 1 }}
									/>
								}
								label="Extra Rollen"
							/>
						</Tooltip>
					</>
				) : (
					<>
						<Tooltip title="Logs uploaden">
							<IconButton>
								<CloudUploadIcon />
							</IconButton>
						</Tooltip>
					</>
				)}
			</Stack>
			<WingMenu
				anchorEl={anchorEl}
				wings={wings}
				strikes={strikes}
				onClose={handleClose}
				onClick={handleEncounterClick}
			/>
		</Box>
	);
};

export default Toolbar;
