import { Box, Card, CardContent, Icon, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { terminState, userRaid } from "models/Types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnmeldungState, listRaidsForPlayer } from "../services/endpoints/raids";

const MyRaidPage = () => {
	const [raids, setRaids] = useState<userRaid[]>([]);
	const [anmeldungen, setAnmeldungen] = useState<terminState[]>([]);

	useEffect(() => {
		const fetchRaids = async () => {
			const raids = await listRaidsForPlayer();
			const anmeldung = await getAnmeldungState();

			setRaids(raids);
			setAnmeldungen(anmeldung);
		};

		fetchRaids().catch(console.error);
	}, []);

	const getRole = (role: number) => {
		let text = "Rolle: ";
		switch (role) {
			case 0:
				text += "Spieler";
				break;
			case 1:
				text += "Lieutenant";
				break;
			case 2:
				text += "Raidleiter";
				break;
		}

		return text;
	};

	const getAnmeldung = (raid: userRaid) => {
		const icons = ["check_circle", "check_circle_outline", "cancel", "warning"];
		let icon = "";

		let anmeldung = anmeldungen.find((a) => a.raid === raid.id);
		if (anmeldung) {
			icon = icons.slice(anmeldung.type)[0];
		}

		return icon;
	};

	return (
		<Box>
			<h2>Meine Raids</h2>
			<Card>
				<CardContent>
					<List>
						{raids.map((r) => (
							<ListItem
								key={r.id}
								secondaryAction={
									<IconButton edge="end">
										<Icon>{getAnmeldung(r)}</Icon>
									</IconButton>
								}>
								<ListItemButton component={Link} to={r.id.toString()}>
									<ListItemText primary={r.name} secondary={getRole(r.role)} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</CardContent>
			</Card>
		</Box>
	);
};

export default MyRaidPage;
