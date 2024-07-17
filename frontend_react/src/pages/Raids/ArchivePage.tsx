import { useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { Box, Card, CardContent, Grid, Pagination } from "@mui/material";
import axios from "axios";

import { SpielerTermin } from "models/Spieler";
import { Termin } from "models/Termin";
import { userRaid } from "models/Types";
import TerminOverview from "../../components/Raids/TerminOverview";
import { listArchived } from "../../services/endpoints/termine";

const ArchivePage = () => {
	const raid = useRouteLoaderData("raidPage") as userRaid;

	const perPage = 5;
	const [data, setData] = useState<(Termin & SpielerTermin)[]>([]);
	const [termine, setTermine] = useState<(Termin & SpielerTermin)[]>([]);
	const [maxPage, setMaxPage] = useState(0);
	const [page, setPage] = useState(1);

	useEffect(() => {
		const abortController = new AbortController();

		const getData = async () => {
			try {
				const data = await listArchived(raid.id);
				setData(data as (Termin & SpielerTermin)[]);
				setMaxPage(Math.max(data.length / perPage, 1));

				currentData(data as (Termin & SpielerTermin)[]);
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

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	useEffect(() => {
		currentData(data);
	}, [page]);

	const currentData = (data: (Termin & SpielerTermin)[]) => {
		const begin = (page - 1) * perPage;
		const end = begin + perPage;
		setTermine(data.slice(begin, end));
	};

	return (
		<Box>
			<Card>
				<CardContent>
					<Grid container>
						<Grid xs={12} sm={6} md={4} lg={3}>
							<Pagination count={maxPage} page={page} onChange={handlePageChange} />
							<TerminOverview termine={termine} archive />
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</Box>
	);
};

export default ArchivePage;
