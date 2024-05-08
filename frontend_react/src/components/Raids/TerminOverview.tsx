import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Pagination } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { listActive, listArchived } from "../../services/endpoints/termine";

import { SpielerTermin } from "models/Spieler";
import { Termin } from "models/Termin";
import { userRaid } from "models/Types";
import axios from "axios";
import { useAppDispatch } from "../../store/hooks";
import { setTermin } from "../../store/slices/terminSlice";

interface IProps {
	raid: userRaid;
	archive?: boolean;
}

const TerminOverview = (props: IProps) => {
	const { raid, archive } = props;

	const [termine, setTermine] = useState<(Termin & SpielerTermin)[]>([]);

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	useEffect(() => {
		const abortController = new AbortController();

		const getData = async () => {
			try {
				if (archive) {
					const data = await listArchived(raid.id);
					setTermine(data as (Termin & SpielerTermin)[]);
				} else {
					const data = await listActive(raid.id);
					setTermine(data);
				}
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

	const getPrimaryText = (termin: Termin) => {
		return termin.dateString;
	};

	const getSecondaryText = (termin: Termin) => {
		let text = termin.time;

		if (termin.endtime) {
			text += " - " + termin.endtime;
		}

		return text;
	};

	const getIcon = (termin: SpielerTermin) => {
		if (archive) {
			return null;
		}

		if (termin.type == null) {
			return "warning";
		}
		const icons = ["check_circle", "check_circle_outline", "cancel"];
		return icons[termin.type];
	};

	const handleClick = (termin: Termin) => {
		dispatch(setTermin(termin));
		navigate(`${termin.id}`);
	}

	const [page, setPage] = useState(1);
	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	}

	return (
		<Card>
			<CardContent>
				<Grid container>
					<Grid xs={12} sm={6} md={4} lg={3}>
						{ archive ? <Pagination count={7} page={page} onChange={handlePageChange} /> : null }
						<List>
							{termine.map((t) => (
								<ListItem key={t.id}>
									<ListItemButton onClick={() => handleClick(t)}>
										<ListItemText primary={getPrimaryText(t)} secondary={getSecondaryText(t)} />
										<ListItemIcon>
											<Icon>{getIcon(t)}</Icon>
										</ListItemIcon>
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default TerminOverview;
