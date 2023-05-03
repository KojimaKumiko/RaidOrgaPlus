import React, { useEffect, useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";
import { useDispatch } from "react-redux";

import { getUsersThunk } from "../store/slices/moderationSlice";

import RaidManagement from "../components/Moderation/RaidManagement";
import UserOverview from "../components/Moderation/UserOverview";
import { TabPanel, a11yProps } from "../components/Misc/TabPanel";

const ModerationPage = () => {
	const [value, setValue] = useState(0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUsersThunk());
	}, [dispatch]);

	return (
		<Box>
			<h2>Moderation</h2>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={value} onChange={handleChange} aria-label="moderation tabs">
					<Tab label="Spieler Verwaltung" {...a11yProps("moderation-tab-0")} />
					<Tab label="Raid Verwaltung" {...a11yProps("moderation-tab-1")} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0} label="moderation-tab-0">
				<UserOverview />
			</TabPanel>
			<TabPanel value={value} index={1} label="moderation-tab-1">
				<RaidManagement />
			</TabPanel>
		</Box>
	);
};

export default ModerationPage;
