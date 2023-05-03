import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import TabPanel from "../Misc/TabPanel";
import { Spieler } from "models/Spieler";
import { WeeklyProgress } from "./WeeklyProgress";

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

	return (
		<Box sx={{ bgcolor: "background.paper" }}>
			<Tabs value={value} onChange={handleChange}>
				<Tab label="Weekly Progress" />
				<Tab label="Trophäen" />
				<Tab label="Erfolge" />
			</Tabs>
			<TabPanel value={value} index={0} label="progress-tab-0">
				<WeeklyProgress user={user} ownProfile={ownProfile} />
			</TabPanel>
			<TabPanel value={value} index={1} label="progress-tab-1">
				<h3>Trophäen</h3>
			</TabPanel>
			<TabPanel value={value} index={2} label="progress-tab-2">
				<h3>Erfolge</h3>
			</TabPanel>
		</Box>
	);
};

export default ProgressOverview;
