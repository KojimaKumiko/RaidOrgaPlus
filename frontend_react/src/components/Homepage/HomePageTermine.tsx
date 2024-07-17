import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	Container,
	Icon,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";

import { homepageTermin } from "models/Types";
import { getHomepageTermine } from "../../services/endpoints/termine";
import { useAppDispatch } from "../../store/hooks";
import { setTermin } from "../../store/slices/terminSlice";

const HomePageTermine = () => {
	const [termine, setTermine] = useState<homepageTermin[]>([]);

	useEffect(() => {
		const abortController = new AbortController();

		const getData = async () => {
			try {
				const data = await getHomepageTermine(abortController.signal);
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
	});

	return (
		<Container maxWidth="xs" sx={{ marginLeft: 0 }}>
			<Typography variant="h5" marginBottom={3}>
				Kommende Termine
			</Typography>
			<Card>
				<CardContent>
					<Grid container>
						<Grid xs={12} sm={12} md={12} lg={12}>
							<Termin termine={termine} />
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</Container>
	);
};

interface TerminProps {
	termine: homepageTermin[];
}

const Termin = (props: TerminProps) => {
	const { termine } = props;

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const getPrimaryText = (termin: homepageTermin) => {
		return `${termin.dateString} (${termin.name})`;
	};

	const getSecondaryText = (termin: homepageTermin) => {
		let text = termin.time;

		if (termin.endtime) {
			text += " - " + termin.endtime;
		}

		return text;
	};

	const getIcon = (termin: homepageTermin) => {
		if (termin.type == null) {
			return "warning";
		}
		const icons = ["check_circle", "check_circle_outline", "cancel"];
		return icons[termin.type];
	};

	const handleClick = (termin: homepageTermin) => {
		dispatch(setTermin(termin));
		navigate(`raids/${termin.raidID}/termine/${termin.id}`);
	};

	return (
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
	);
};

export default HomePageTermine;
