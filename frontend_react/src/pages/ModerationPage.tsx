import { Box, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import RaidOverview from "../components/Moderation/RaidOverview";
import UserOverview from "../components/Moderation/UserOverview";
import { getUsersThunk } from "../store/slices/moderationSlice";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			style={{ visibility: value === index ? "visible" : "hidden" }}
			id={`moderation-tabpanel-${index}`}
			aria-labelledby={`moderation-tab-${index}`}
			{...other}>
			{value === index && (
				<Box sx={{ p: 3 }}>
					{children}
				</Box>
			)}
		</div>
	);
};

const a11yProps = (index: number) => {
	return {
		id: `moderation-tab-${index}`,
		"aria-controls": `moderation-tabpanel-${index}`,
	};
};

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
					<Tab label="Spieler Verwaltung" {...a11yProps(0)} />
					<Tab label="Raid Verwaltung" {...a11yProps(1)} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<UserOverview />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<RaidOverview />
			</TabPanel>
		</Box>
	);
};

export default ModerationPage;
