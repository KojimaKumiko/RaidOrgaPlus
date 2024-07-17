import { useNavigate } from "react-router-dom";
import { Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import { SpielerTermin } from "models/Spieler";
import { Termin } from "models/Termin";
import { useAppDispatch } from "../../store/hooks";
import { setTermin } from "../../store/slices/terminSlice";

interface IProps {
	termine: (Termin & SpielerTermin)[];
	archive?: boolean;
}

const TerminOverview = (props: IProps) => {
	const { termine, archive } = props;

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

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

export default TerminOverview;
