import { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";

import TabPanel from "../Misc/TabPanel";
import WeeklyProgress from "./WeeklyProgress";
import Trophies from "./Trophies";

import { listEncounterGrouped } from "../../services/endpoints/gamedata";
import { getInsights, getProgress } from "../../services/endpoints/progress";
import { Spieler } from "models/Spieler";
import { Encounter } from "models/Encounter";

interface IProgressOverviewProps {
	user: Spieler;
	ownProfile: boolean;
}

const ProgressOverview = (props: IProgressOverviewProps) => {
	const { user, ownProfile } = props;

	const [value, setValue] = useState(0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const [encounters, setEncounters] = useState<Encounter[][]>([]);
	const [progress, setProgress] = useState<any[]>([]);
	const [insights, setInsights] = useState<any[]>([]);
	useEffect(() => {
		const getData = async () => {
			const result = await listEncounterGrouped();
			setEncounters(result);

			const prog = await getProgress(ownProfile ? null : user.id);
			setProgress(prog);

			const ins = await getInsights(ownProfile ? null : user.id);
			setInsights(ins);
		};

		getData().catch(console.error);
	}, [ownProfile, user.id]);

	return (
		<Box sx={{ bgcolor: "background.main", mt: 2 }}>
			<Tabs value={value} onChange={handleChange}>
				<Tab label="Weekly Progress" />
				<Tab label="Trophäen" />
				<Tab label="Erfolge" />
			</Tabs>
			<TabPanel value={value} index={0} label="progress-tab-0">
				<WeeklyProgress encounters={encounters} progress={progress} />
			</TabPanel>
			<TabPanel value={value} index={1} label="progress-tab-1">
				<Trophies insights={insights} />
			</TabPanel>
			<TabPanel value={value} index={2} label="progress-tab-2">
				<h3>Erfolge</h3>
			</TabPanel>
		</Box>
	);
};

export default ProgressOverview;
