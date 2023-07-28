import { useParams, useRouteLoaderData } from "react-router-dom";
import { Box } from "@mui/material";

import Lieutenants from "../../components/Raids/Lieutenants";
import LogUpload from "../../components/Raids/LogUpload";
import { userRaid } from "models/Types";

const RaidSettingsPage = () => {
	// const { raidId } = useParams();
	const raid = useRouteLoaderData("raidPage") as userRaid;

	return (
		<Box sx={{ m: "1%" }}>
			<h1>Einstellungen</h1>
			<Lieutenants raidId={raid.id} disabled={false} />
			<LogUpload raid={raid} />
		</Box>
	);
}

export default RaidSettingsPage;