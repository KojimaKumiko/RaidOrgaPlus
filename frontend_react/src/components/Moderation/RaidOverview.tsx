import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";

import { ModRaid } from "models/Raid";
import { getRaids } from "../../services/endpoints/moderation";
import { ExpandMore } from "@mui/icons-material";
import RaidDetails from "./RaidDetails";

const a11yProps = (accname: string) => {
	return {
		id: `panel-${accname}-header`,
		"aria-controls": `panel-${accname}-content`,
	};
};

const RaidOverview = () => {
	const [expanded, setExpanded] = useState("");
	const [raids, setRaids] = useState<ModRaid[]>([]);

	useEffect(() => {
		const fetchRaids = async () => {
			const raids = await getRaids();

			setRaids(raids);
		};

		fetchRaids().catch(console.error);
	}, []);

	const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : "");
	};

	return (
		<Box>
			{raids.map((r) => (
				<Accordion
					expanded={expanded === r.name}
					onChange={handleChange(r.name)}
					TransitionProps={{ unmountOnExit: true }}
					key={r.id}>
					<AccordionSummary expandIcon={<ExpandMore />} {...a11yProps(r.name)} sx={{ px: 2, py: 1.5 }}>
						<Typography>{r.name}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<RaidDetails raid={r} />
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
};

export default RaidOverview;
