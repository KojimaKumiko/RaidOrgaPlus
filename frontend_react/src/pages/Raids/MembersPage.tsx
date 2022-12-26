import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/system";
import Grid from "@mui/material/Unstable_Grid2";

import { listPlayers } from "../../services/endpoints/raids";
import RaidMember from "../../components/Raids/RaidMember";
import { Spieler } from "../../../../models/Spieler";

const MembersPage = () => {
	const [members, setMembers] = useState<Spieler[]>([]);
	const { raidId } = useParams();

	useEffect(() => {
		const getMembers = async () => {
			setMembers(await listPlayers(Number(raidId)));
		};

		getMembers().catch(console.error);
	}, [raidId]);

	return (
		<Box>
			<h2>Spielerliste</h2>
			<Grid container>
				{members.map((member) => (
					<Grid xs={12} sm={6} lg={4} xl={3} key={member.id} sx={{padding: 0.5}}>
						<RaidMember member={member} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default MembersPage;
