import { Box, Button } from "@mui/material";
import { useRouteLoaderData } from "react-router-dom";

import TerminOverview from "../../components/Raids/TerminOverview";

import { userRaid } from "models/Types";

const TerminPage = () => {
	const raid = useRouteLoaderData("raidPage") as userRaid;

	return (
		<Box>
			<TerminOverview raid={raid} />
			<Button color="success" variant="contained" sx={{ mt: "1rem" }}>
				Neuer Termin
			</Button>
		</Box>
	);
};

export default TerminPage;
