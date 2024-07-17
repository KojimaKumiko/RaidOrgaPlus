import { useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { Box, Button, Card, CardContent } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";

import TerminOverview from "../../components/Raids/TerminOverview";

import { userRaid } from "models/Types";
import { SpielerTermin } from "models/Spieler";
import { Termin } from "models/Termin";
import { listActive } from "../../services/endpoints/termine";

const TerminPage = () => {
	const raid = useRouteLoaderData("raidPage") as userRaid;

	const [termine, setTermine] = useState<(Termin & SpielerTermin)[]>([]);

	useEffect(() => {
		const abortController = new AbortController();

		const getData = async () => {
			try {
				const data = await listActive(raid.id);
				setTermine(data);
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log(error);
				} else {
					throw error;
				}
			}
		};

		getData().catch(console.error);

		return () => {
			abortController.abort();
		};
	}, []);

	return (
		<Box>
			<Card>
				<CardContent>
					<Grid container>
						<Grid xs={12} sm={6} md={4} lg={3}>
							<TerminOverview termine={termine} />
						</Grid>
					</Grid>
				</CardContent>
			</Card>
			<Button color="success" variant="contained" sx={{ mt: "1rem" }}>
				Neuer Termin
			</Button>
		</Box>
	);
};

export default TerminPage;
