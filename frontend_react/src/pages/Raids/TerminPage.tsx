import { Box, Button, Card, CardContent, Grid } from "@mui/material";
import { useRouteLoaderData } from "react-router-dom";

import TerminOverview from "../../components/Raids/TerminOverview";

import { userRaid } from "models/Types";
import axios from "axios";
import { SpielerTermin } from "models/Spieler";
import { Termin } from "models/Termin";
import { useState, useEffect } from "react";
import { listActive } from "../../services/endpoints/termine";

const TerminPage = () => {
	const raid = useRouteLoaderData("raidPage") as userRaid;

	const [termine, setTermine] = useState<(Termin & SpielerTermin)[]>([]);

	useEffect(() => {
		const abortController = new AbortController();

		const getData = async () => {
			try {
				// 	const data = await listArchived(raid.id);
				// 	setTermine(data as (Termin & SpielerTermin)[]);

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
							{/* { archive ? <Pagination count={7} page={page} onChange={handlePageChange} /> : null } */}
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
