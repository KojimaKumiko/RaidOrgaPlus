import { useState } from "react";

import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CloseReason,
	IconButton,
	SpeedDial,
	SpeedDialAction,
	Stack,
	ToggleButton,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import SettingsIcon from "@mui/icons-material/Settings";
import InputIcon from "@mui/icons-material/Input";
import RefreshIcon from "@mui/icons-material/Refresh";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { encIcon } from "../../services/icons";
import CompElement from "./CompElement";
import { copyElements, deleteBoss, reloadBlanko, setCM } from "../../services/endpoints/aufstellungen";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addElements, selectComposition, selectTermin, setComposition } from "../../store/slices/terminSlice";
import { fixRoles } from "../../utils/misc";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CompositionProps {
	comp: Aufstellung & Encounter;
}

const Composition = (props: CompositionProps) => {
	const { comp } = props;

	const dispatch = useAppDispatch();
	const termin = useAppSelector(selectTermin)!;
	const isArchived = termin.isArchived;

	const [openSpeedDial, setOpenSpeedDial] = useState(false);
	const onSpeedDialClick = () => {
		setOpenSpeedDial(!openSpeedDial);
	};

	const onCloseSpeedDial = (reason: CloseReason) => {
		if (reason !== "mouseLeave") {
			setOpenSpeedDial(false);
		}
	};

	const getAvatarSrc = () => {
		return encIcon(comp?.abbr);
	};

	const hasCm = () => {
		return comp?.has_cm;
	};

	const [copyActive, setCopyActive] = useState(false);
	const toggleCopyActive = () => {
		setCopyActive(!copyActive);
	};

	const copyComposition = async (copyComp: Aufstellung & Encounter) => {
		const copiedElements = await copyElements(copyComp.id, comp.id);
		setCopyActive(false);
		fixRoles(copiedElements);
		dispatch(addElements(copiedElements));
	};

	const loadTemplate = async () => {
		const tempElements = await reloadBlanko(comp.id);
		fixRoles(tempElements);
		dispatch(addElements(tempElements));
	};

	const [isCM, setIsCM] = useState(comp.is_cm);
	const toggleCM = async () => {
		await setCM(comp.id, !isCM);
		setIsCM(!isCM);
	};

	const removeBoss = async () => {
		dispatch(setComposition(await deleteBoss(comp.id, termin.id)));
	};

	const [successColor, setSuccessColor] = useState("white");
	const [success, setSuccess] = useState(comp.success);
	const toggleSuccess = () => {
		// TODO: call to db to change the value there aswell.
		setSuccessColor(!success ? "green" : "white");
		setSuccess(!success);
	}

	return (
		<Card sx={{ height: "100%" }}>
			<CardContent>
				<Stack direction="row" mb={2}>
					<Stack direction="row" alignItems="center">
						<Avatar src={getAvatarSrc()} sx={{ height: 52, width: 52, mr: 2 }} />
						<Typography variant="h6" sx={[isCM && { color: "#E91E63" }]}>
							{comp.name} {isCM ? "CM" : ""}
						</Typography>
					</Stack>
					{isArchived ? (
						<Box sx={{ flexGrow: 1, display: "flex", justifyContent: "end", alignItems: "center" }}>
							<IconButton sx={{ color: successColor }} onClick={toggleSuccess}>
								{ success ? <CheckCircleIcon /> : <CheckCircleOutlineIcon /> }
							</IconButton>
						</Box>
					) : (
						<Box sx={{ transform: "translateZ(0px)", flexGrow: 1 }}>
							{copyActive ? (
								<IconButton sx={{ position: "absolute", right: 0 }}>
									<ArrowBackIcon onClick={toggleCopyActive} />
								</IconButton>
							) : (
								<SpeedDial
									icon={<SettingsIcon />}
									onClick={onSpeedDialClick}
									onClose={(e, r) => onCloseSpeedDial(r)}
									open={openSpeedDial}
									ariaLabel="SpeedDial"
									direction="down"
									sx={{ position: "absolute", right: 0 }}
									FabProps={{
										sx: { height: 40, width: 40, backgroundColor: "#272727", color: "white" },
									}}>
									<SpeedDialAction
										tooltipTitle="Einträge hierher kopieren"
										icon={<InputIcon />}
										onClick={toggleCopyActive}
										FabProps={{ sx: { bgcolor: "primary.dark", color: "white" } }}
									/>
									<SpeedDialAction
										tooltipTitle="Blanko laden"
										icon={<RefreshIcon />}
										onClick={loadTemplate}
										FabProps={{ sx: { bgcolor: "success.main", color: "white" } }}
									/>
									<SpeedDialAction
										tooltipTitle="CM umschalten"
										icon={<NewReleasesIcon />}
										onClick={toggleCM}
										FabProps={{
											sx: [
												{ bgcolor: "#e91e63", color: "white" },
												!hasCm() && { display: "none" },
											],
										}}
									/>
									<SpeedDialAction
										tooltipTitle="Boss löschen"
										icon={<DeleteIcon />}
										onClick={removeBoss}
										FabProps={{ sx: { bgcolor: "error.main", color: "white" } }}
									/>
								</SpeedDial>
							)}
						</Box>
					)}
				</Stack>
				{copyActive ? <CompositionCopy comp={comp} copy={copyComposition} /> : <CompositionBody comp={comp} isArchived={isArchived} />}
			</CardContent>
		</Card>
	);
};

interface BodyProps {
	comp: Aufstellung & Encounter;
	isArchived: boolean;
}

const CompositionBody = (props: BodyProps) => {
	const { comp, isArchived } = props;

	const getElements = () => {
		const elements: JSX.Element[] = [];
		for (let i = 1; i <= 10; i++) {
			elements.push(
				<Grid key={i} xs={6} sx={{ padding: "4px" }}>
					<CompElement edit={!isArchived} position={i} composition={comp} />
				</Grid>
			);
		}
		return elements;
	};

	return <Grid container>{getElements()}</Grid>;
};

interface CopyProps {
	comp: Aufstellung & Encounter;
	copy: (comp: Aufstellung & Encounter) => void;
}

const CompositionCopy = (props: CopyProps) => {
	const { comp, copy } = props;
	const compositions = useAppSelector(selectComposition);
	const filtered = compositions.filter((c) => c.id !== comp.id);

	const getAvatarSrc = (abbr: string) => {
		return encIcon(abbr);
	};

	const getAvatars = () => {
		const elements = filtered.map((c) => {
			return (
				<Avatar
					key={c.id}
					src={getAvatarSrc(c.abbr)}
					sx={{ cursor: "pointer", margin: "5px" }}
					onClick={() => copy(c)}
				/>
			);
		});

		return elements;
	};

	return (
		<Box>
			<Typography sx={{ textAlign: "center" }}>Kopieren von:</Typography>
			<Stack direction="row" justifyContent="center">
				{getAvatars()}
			</Stack>
		</Box>
	);
};

export default Composition;
