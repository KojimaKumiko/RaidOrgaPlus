import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/system";
import { Accordion, AccordionDetails, AccordionSummary, Button, Chip, TextField } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import DoneIcon from "@mui/icons-material/Done";
import Grid from "@mui/material/Unstable_Grid2";

import {
	addFilter,
	archivePlayer,
	getUsersThunk,
	removeFilter,
	restorePlayer,
	selectActiveFilters,
	selectFilteredUsers,
	selectUserLength,
	setNameFilter,
	setRoleFilter,
} from "../../store/slices/moderationSlice";
import UserHeader from "./UserHeader";
import UserDetails from "./UserDetails";
import UserActions from "./UserActions";
import { InputTarget } from "../../models/types";
import { useAppDispatch } from "../../store/hooks";
import { User } from "models/Types";

const a11yProps = (accname: string) => {
	return {
		id: `panel-${accname}-header`,
		"aria-controls": `panel-${accname}-content`,
	};
};

const UserOverview = () => {
	const [expanded, setExpanded] = useState("");

	const users = useSelector(selectFilteredUsers);
	const userLength = useSelector(selectUserLength);
	const activeFilters = useSelector(selectActiveFilters);

	const dispatch = useAppDispatch();

	const filters = [
		"Mit Discord",
		"Ohne Discord",
		"1. Raid vier Wochen her",
		"Archiviert",
		"Nicht Archiviert",
	];

	const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : "");
	};

	const handlePlayerSearch = (e: InputTarget) => {
		dispatch(setNameFilter(e.value));
	};

	const handleRoleSearch = (e: InputTarget) => {
		dispatch(setRoleFilter(e.value));
	};

	const handleFilterClick = (filter: string) => {
		let index = activeFilters.indexOf(filter);
		if (index > -1) {
			dispatch(removeFilter(filter));
		} else {
			dispatch(addFilter(filter));
		}
	};

	const handleRefresh = () => {
		dispatch(getUsersThunk(true));
	};

	const handleIcon = (filter: string) => {
		let index = activeFilters.indexOf(filter);
		if (index > -1) {
			return <DoneIcon />;
		} else {
			return undefined;
		}
	};

	const handleArchivePlayer = (user: User) => (archiveDate: Date) => {
		const id = user.id;
		dispatch(archivePlayer({ id, archiveDate }));
	}

	const handleRestorePlayer = (user: User) => () => {
		dispatch(restorePlayer(user.id));
	}

	return (
		<Box>
			<Grid container spacing={1}>
				{filters.map((f) => (
					<Grid key={f}>
						<Chip label={f} clickable onClick={() => handleFilterClick(f)} icon={handleIcon(f)} />
					</Grid>
				))}
			</Grid>
			<Grid container spacing={4} sx={{ marginBottom: 2, alignItems: "flex-end" }}>
				<Grid xs={12} sm={5}>
					<TextField
						label="Suche nach Spielern"
						onChange={(e) => handlePlayerSearch(e.target)}
						variant="standard"
						fullWidth
					/>
				</Grid>
				<Grid xs={12} sm={5}>
					<TextField
						label="Suche nach Rollen"
						onChange={(e) => handleRoleSearch(e.target)}
						variant="standard"
						fullWidth
					/>
				</Grid>
				<Grid xs={12} sm={2}>
					<Button
						variant="contained"
						color="neutral"
						sx={{ minWidth: 80, maxWidth: 160, width: "100%" }}
						onClick={handleRefresh}>
						Refresh
					</Button>
				</Grid>
			</Grid>
			<Box>
				<p>
					Zeige: {users.length} / {userLength}
				</p>
			</Box>
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
						<UserActions user={u} onArchivePlayer={handleArchivePlayer(u)} onRestorePlayer={handleRestorePlayer(u)} />
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
};

export default UserOverview;
