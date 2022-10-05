import React, { useState } from "react";
import { Box } from "@mui/system";
import { Accordion, AccordionDetails, AccordionSummary, Chip, Stack, TextField } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useSelector } from "react-redux";
import DoneIcon from "@mui/icons-material/Done";

import { selectUsers } from "../../store/slices/moderationSlice";
import UserHeader from "./UserHeader";
import UserDetails from "./UserDetails";
import UserActions from "./UserActions";
import { InputTarget } from "../../models/types";

const a11yProps = (accname: string) => {
	return {
		id: `panel-${accname}-header`,
		"aria-controls": `panel-${accname}-content`,
	};
};

const UserOverview = () => {
	const [expanded, setExpanded] = useState("");
	const [activeFilters, setActiveFilter] = useState<string[]>([]);

	const users = useSelector(selectUsers);

	const filters = [
		"Mit Discord",
		"Ohne Discord",
		"14 Tage Inaktiv",
		"1. Raid vier Wochen her",
		"Archiviert",
		"Nicht Archiviert",
	];

	const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : "");
	};

	const handlePlayerSearch = (e: InputTarget) => {
		console.log(e.value);
	};

	const handleRoleSearch = (e: InputTarget) => {
		console.log(e.value);
	};

	const handleFilterClick = (filter: string) => {
		let index = activeFilters.indexOf(filter);
		if (index > -1) {
			setActiveFilter(activeFilters.filter((f) => f !== filter));
		} else {
			setActiveFilter([ ...activeFilters, filter ]);
		}
	};

	const handleIcon = (filter: string) => {
		let index = activeFilters.indexOf(filter);
		if (index > -1) {
			return <DoneIcon />;
		} else {
			return undefined;
		}
	};

	return (
		<Box>
			<Stack direction="row">
				{filters.map(f => <Chip label={f} clickable onClick={() => handleFilterClick(f)} icon={handleIcon(f)} />)}
			</Stack>
			<Stack direction="row" spacing={4} justifyContent="center" sx={{ marginBottom: 4 }}>
				<TextField
					label="Suche nach Spielern"
					onChange={(e) => handlePlayerSearch(e.target)}
					sx={{ width: 650 }}
					variant="standard"
				/>
				<TextField
					label="Suche nach Rollen"
					onChange={(e) => handleRoleSearch(e.target)}
					sx={{ width: 650 }}
					variant="standard"
				/>
			</Stack>
			{users.map((u) => (
				<Accordion
					expanded={expanded === u.accname}
					onChange={handleChange(u.accname)}
					TransitionProps={{ unmountOnExit: true }}
					key={u.id}>
					<AccordionSummary expandIcon={<ExpandMore />} {...a11yProps(u.accname)} sx={{ px: 2, py: 1.5 }}>
						<UserHeader user={u} />
					</AccordionSummary>
					<AccordionDetails>
						<UserDetails user={u} />
						<UserActions user={u} />
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
};

export default UserOverview;
