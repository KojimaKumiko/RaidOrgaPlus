import { useRouteLoaderData } from "react-router-dom";

import { Avatar, Box, Card, CardContent, SpeedDial, SpeedDialAction, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import SettingsIcon from "@mui/icons-material/Settings";
import InputIcon from "@mui/icons-material/Input";
import RefreshIcon from "@mui/icons-material/Refresh";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import DeleteIcon from "@mui/icons-material/Delete";

import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { encIcon } from "../../services/icons";
import CompElement from "./CompElement";
import { element } from "models/Types";
import { CompPageLoader } from "../../models/types";
import { deleteBoss } from "../../services/endpoints/aufstellungen";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectElements, setComposition } from "../../store/slices/terminSlice";

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

	const removeBoss = async () => {
		dispatch(setComposition(await deleteBoss(comp.id, termin.id)));
	};

	return (
		<Card>
			<CardContent>
				<Stack direction="row" mb={2}>
					<Stack direction="row" alignItems="center">
						<Avatar src={getAvatarSrc()} sx={{ height: 52, width: 52, mr: 2 }} />
						<Typography variant="h6">{comp.name}</Typography>
					</Stack>
					<Box sx={{ transform: "translateZ(0px)", flexGrow: 1 }}>
						<SpeedDial
							icon={<SettingsIcon />}
							ariaLabel="SpeedDial"
							direction="down"
							sx={{ position: "absolute", right: 16 }}
							FabProps={{ sx: { height: 40, width: 40 } }}>
							<SpeedDialAction tooltipTitle="Einträge hierher kopieren" icon={<InputIcon />} />
							<SpeedDialAction tooltipTitle="Blanko laden" icon={<RefreshIcon />} />
							<SpeedDialAction tooltipTitle="CM umschalten" icon={<NewReleasesIcon />} />
							<SpeedDialAction tooltipTitle="Boss löschen" icon={<DeleteIcon />} onClick={removeBoss} />
						</SpeedDial>
					</Box>
				</Stack>
				<Body comp={comp} />
			</CardContent>
		</Card>
	);
};

interface BodyProps {
	comp: Aufstellung & Encounter;
}

const Body = (props: BodyProps) => {
	const { comp } = props;

	const getElements = () => {
		const elements: JSX.Element[] = [];
		for (let i = 1; i <= 10; i++) {
			elements.push(
				<Grid key={i} xs={6}>
					<CompElement edit position={i} composition={comp} />
				</Grid>
			);
		}
		return elements;
	};

	return <Grid container>{getElements()}</Grid>;
};

export default Composition;
