import { Divider, Stack, Typography } from "@mui/material";
import { User } from "models/Types";

interface Props {
	user: User;
}

const UserDetails = (props: Props) => {
	const lastActive = (): string => {
		if (!props.user.lastActive) return "Keine Aufzeichnung";
		const date = Number(new Date(props.user.lastActive));
		const diff = Number(new Date()) - date;
		const minutes = Math.ceil(diff / (1000 * 60));
		if (minutes === 1) return "gerade eben";
		else if (minutes < 60) return `vor ${minutes} Minuten`;
		const hours = Math.floor(minutes / 60);
		if (hours === 1) return "vor 1 Stunde";
		else if (hours < 24) return `vor ${hours} Stunden`;
		const days = Math.floor(hours / 24);
		if (days === 1) return "vor 1 Tag";
		else return `vor ${days} Tagen`;
	};

	const parseDate = (dateString: any): string => {
		if (dateString) {
			const date = new Date(dateString);
			const dateOptions: any = { day: "2-digit", month: "2-digit", year: "numeric" };
			return date.toLocaleDateString("de-DE", dateOptions);
		} else {
			return "Nie";
		}
	};

	return (
		<Stack>
			<Typography>
				<span style={{ fontWeight: "bold" }}>Account Name:</span> {props.user.accname}
			</Typography>
			<Typography>
				<span style={{ fontWeight: "bold" }}>Anzeige Name:</span> {props.user.name}
			</Typography>
			<Typography>
				<span style={{ fontWeight: "bold" }}>Zuletzt Online:</span> {lastActive()}
			</Typography>
			<Typography>
				<span style={{ fontWeight: "bold" }}>Erste Raid-Anmeldung:</span> {parseDate(props.user.firstTermin)}
			</Typography>
			<Typography>
				<span style={{ fontWeight: "bold" }}>Letzte Raid-Anmeldung:</span> {parseDate(props.user.lastTermin)}
			</Typography>
			<Divider />
		</Stack>
	);
};

export default UserDetails;
