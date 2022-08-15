import React, { useState } from "react";
import { Box } from "@mui/system";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useSelector } from "react-redux";

import { selectUsers } from "../../store/slices/moderationSlice";
import UserHeader from "./UserHeader";
import UserDetails from "./UserDetails";
import UserActions from "./UserActions";

const a11yProps = (accname: string) => {
	return {
		id: `panel-${accname}-header`,
		"aria-controls": `panel-${accname}-content`,
	};
};

const UserOverview = () => {
	const [expanded, setExpanded] = useState("");

	const users = useSelector(selectUsers);

	const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : "");
	};

	return (
		<Box>
			{users.map((u) => (
				<Accordion
					expanded={expanded === u.accname}
					onChange={handleChange(u.accname)}
					TransitionProps={{ unmountOnExit: true }}>
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
