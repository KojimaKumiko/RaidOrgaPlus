import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/system";
import Grid from "@mui/material/Unstable_Grid2";

import { kickPlayer, listPlayers } from "../../services/endpoints/raids";
import RaidMember from "../../components/Raids/RaidMember";
import { Spieler } from "../../../../models/Spieler";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddMember from "../../components/Raids/AddMember";

const MembersPage = () => {
	const [members, setMembers] = useState<Spieler[]>([]);
	const [open, setOpen] = useState(false);
	const { raidId } = useParams();

	useEffect(() => {
		const getMembers = async () => {
			setMembers(await listPlayers(Number(raidId)));
		};

		getMembers().catch(console.error);
	}, [raidId]);

	const handleKickPlayer = async (member: Spieler) => {
		const players = await kickPlayer(raidId, member.id);
		setMembers(players);
	}

	const handleClose = () => {
		setOpen(false);
	}

	return (
		<Box sx={{ padding: 1 }}>
			<Button variant="contained" color="success" sx={{ mb: 1 }} onClick={() => setOpen(true)}>
				Spieler Einladen
			</Button>
			<Grid container>
				{members.map((member) => (
					<Grid xs={12} sm={6} lg={4} xl={3} key={member.id} sx={{ padding: 0.5 }}>
						<RaidMember member={member} onKickPlayer={handleKickPlayer} />
					</Grid>
				))}
			</Grid>
			<AddMember open={open} raidId={Number(raidId)} onClose={handleClose} />
		</Box>
	);
};

export default MembersPage;
