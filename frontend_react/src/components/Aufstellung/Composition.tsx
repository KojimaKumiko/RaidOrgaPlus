import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

import {
	Avatar,
	Box,
	Card,
	CardContent,
	IconButton,
	SpeedDial,
	SpeedDialAction,
	Stack,
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
import { element } from "models/Types";
import { CompPageLoader } from "../../models/types";
import { copyElements, deleteBoss, getElements } from "../../services/endpoints/aufstellungen";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addElements, selectComposition, selectElements, setComposition } from "../../store/slices/terminSlice";

interface CompositionProps {
	comp: Aufstellung & Encounter;
}

const Composition = (props: CompositionProps) => {
	const { termin } = useRouteLoaderData("compPage") as CompPageLoader;
	const { comp } = props;

	const dispatch = useAppDispatch();

	const getAvatarSrc = () => {
		return encIcon(comp?.abbr);
	};

	const [copyActive, setCopyActive] = useState(false);
	const toggleCopyActive = () => {
		setCopyActive(!copyActive);
	};

	const copyComposition = async (copyComp: Aufstellung & Encounter) => {
		const copiedElements = await copyElements(copyComp.id, comp.id);
		setCopyActive(false);
		dispatch(addElements(copiedElements));
	};

	const removeBoss = async () => {
		dispatch(setComposition(await deleteBoss(comp.id, termin.id)));
	};

	return (
		<Card sx={{ height: "100%" }}>
			<CardContent>
				<Stack direction="row" mb={2}>
					<Stack direction="row" alignItems="center">
						<Avatar src={getAvatarSrc()} sx={{ height: 52, width: 52, mr: 2 }} />
						<Typography variant="h6">{comp.name}</Typography>
					</Stack>
					<Box sx={{ transform: "translateZ(0px)", flexGrow: 1 }}>
						{copyActive ? (
							<IconButton sx={{ position: "absolute", right: 0 }}>
								<ArrowBackIcon onClick={toggleCopyActive} />
							</IconButton>
						) : (
							<SpeedDial
								icon={<SettingsIcon />}
								ariaLabel="SpeedDial"
								direction="down"
								sx={{ position: "absolute", right: 0 }}
								FabProps={{ sx: { height: 40, width: 40 } }}>
								<SpeedDialAction
									tooltipTitle="Einträge hierher kopieren"
									icon={<InputIcon />}
									onClick={toggleCopyActive}
								/>
								<SpeedDialAction tooltipTitle="Blanko laden" icon={<RefreshIcon />} />
								<SpeedDialAction tooltipTitle="CM umschalten" icon={<NewReleasesIcon />} />
								<SpeedDialAction
									tooltipTitle="Boss löschen"
									icon={<DeleteIcon />}
									onClick={removeBoss}
								/>
							</SpeedDial>
						)}
					</Box>
				</Stack>
				{copyActive ? <CompositionCopy comp={comp} copy={copyComposition} /> : <CompositionBody comp={comp} />}
			</CardContent>
		</Card>
	);
};

interface BodyProps {
	comp: Aufstellung & Encounter;
}

const CompositionBody = (props: BodyProps) => {
	const { comp } = props;

	const getElements = () => {
		const elements: JSX.Element[] = [];
		for (let i = 1; i <= 10; i++) {
			elements.push(
				<Grid key={i} xs={6} sx={{ padding: "4px" }}>
					<CompElement edit position={i} composition={comp} />
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
			return <Avatar key={c.id} src={getAvatarSrc(c.abbr)} sx={{ cursor: "pointer", margin: "5px" }} onClick={() => copy(c)} />;
		});

		return elements;
	};

	return (
		<Box>
			<Typography sx={{ textAlign: "center" }}>Kopieren von:</Typography>
			<Stack direction="row" justifyContent="center">{getAvatars()}</Stack>
		</Box>
	);
};

export default Composition;
