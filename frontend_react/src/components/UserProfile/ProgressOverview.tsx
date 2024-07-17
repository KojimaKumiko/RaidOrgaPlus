import { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "@mui/material";

import TabPanel from "../Misc/TabPanel";
import WeeklyProgress from "./WeeklyProgress";
import Trophies from "./Trophies";

import { getAchievementList, listEncounterGrouped } from "../../services/endpoints/gamedata";
import { getAchievements, getInsights, getProgress } from "../../services/endpoints/progress";
import { Spieler } from "models/Spieler";
import { Encounter } from "models/Encounter";
import Achievements from "./Achievements";
import axios from "axios";

interface IProgressOverviewProps {
	user: Spieler;
	ownProfile: boolean;
	maxWidth: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const ProgressOverview = (props: IProgressOverviewProps) => {
	const { user, ownProfile, maxWidth } = props;

	const [value, setValue] = useState(0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const [encounters, setEncounters] = useState<Encounter[][]>([]);
	const [progress, setProgress] = useState<any[]>([]);
	const [insights, setInsights] = useState<any[]>([]);
	const [achievementList, setAchievementList] = useState<any[]>([]);
	const [achievementsDone, setAchievementsDone] = useState<any[]>([]);
	useEffect(() => {
		const abortController = new AbortController();

		const getData = async () => {
			try {
				const userId = ownProfile ? null : user.id;
				const result = await listEncounterGrouped(abortController.signal);
				const prog = await getProgress(userId, abortController.signal);
				const ins = await getInsights(userId, abortController.signal);
				const achievs = await getAchievementList(abortController.signal);
				const done = await getAchievements(userId, abortController.signal);

				setEncounters(result);
				setProgress(prog);
				setInsights(ins);
				setAchievementList(achievs);
				setAchievementsDone(done);
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
	}, [ownProfile, user.id]);

	return (
		<Container maxWidth={maxWidth} sx={{ bgcolor: "background.main", mt: 2 }}>
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
				<Achievements achievementList={achievementList} achievementsDone={achievementsDone} />
			</TabPanel>
		</Container>
	);
};

export default ProgressOverview;
