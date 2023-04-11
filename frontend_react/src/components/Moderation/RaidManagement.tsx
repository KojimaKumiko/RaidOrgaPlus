import { useEffect, useState } from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
	Typography,
} from "@mui/material";

import { ModRaid } from "models/Raid";
import { createRaid, getRaids } from "../../services/endpoints/moderation";
import { ExpandMore } from "@mui/icons-material";
import RaidDetails from "./RaidDetails";
import RaidOverview from "./RaidOverview";

const a11yProps = (accname: string) => {
	return {
		id: `panel-${accname}-header`,
		"aria-controls": `panel-${accname}-content`,
	};
};

const RaidManagement = () => {
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

	const refreshRaids = async () => {
		const raids = await getRaids();
		setRaids(raids);
	};

	const [createRaidDialogOpen, setCreateRaidDialogOpen] = useState(false);
	const [raidOverviewDialogOpen, setRaidOverviewDialogOpen] = useState(false);
	const [newRaidName, setNewRaidName] = useState("");

	const handleCreateRaid = async () => {
		if (newRaidName != null && newRaidName.trim() != null) {
			setCreateRaidDialogOpen(false);
			await createRaid(newRaidName);
			setNewRaidName("");
			await refreshRaids();
		}
	};

	const handleRaidNameChange = (raidName: string) => {
		setNewRaidName(raidName);
	};

	const handleClose = () => {
		setCreateRaidDialogOpen(false);
		setRaidOverviewDialogOpen(false);
	};

	return (
		<Box>
			<Stack direction="row" sx={{ mb: 2 }}>
				<Button
					variant="contained"
					color="success"
					sx={{ mr: 2 }}
					onClick={() => setCreateRaidDialogOpen(true)}>
					Raid Erstellen
				</Button>
				<Button variant="contained" color="success" onClick={() => setRaidOverviewDialogOpen(true)}>
					Raid Overview
				</Button>
			</Stack>
			<CreateRaidDialog
				open={createRaidDialogOpen}
				onClose={handleClose}
				handleRaidNameChange={handleRaidNameChange}
				handleCreateRaid={handleCreateRaid}
			/>
			<RaidOverviewDialog open={raidOverviewDialogOpen} raids={raids} onClose={handleClose} />
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
						<RaidDetails raid={r} refreshRaids={refreshRaids} />
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
};

interface ICreateRaidDialogProps {
	open: boolean;
	onClose: () => void;
	handleRaidNameChange: (raidName: string) => void;
	handleCreateRaid: () => void;
}

const CreateRaidDialog = (props: ICreateRaidDialogProps) => {
	const { open, onClose, handleRaidNameChange, handleCreateRaid } = props;

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Raid Erstellen</DialogTitle>
			<DialogContent>
				<TextField
					variant="outlined"
					label="Name des Raides"
					onChange={(e) => handleRaidNameChange(e.currentTarget.value)}
					margin="dense"
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="neutral" onClick={onClose}>
					Abbrechen
				</Button>
				<Button variant="contained" color="neutral" onClick={handleCreateRaid}>
					Raid Erstellen
				</Button>
			</DialogActions>
		</Dialog>
	);
};

interface IRaidOverviewDialogProps {
	open: boolean;
	raids: ModRaid[];
	onClose: () => void;
}

const RaidOverviewDialog = (props: IRaidOverviewDialogProps) => {
	const { open, raids, onClose } = props;

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { minHeight: "90vh" }}}>
			{/* <DialogTitle>Raid Overview</DialogTitle> */}
			<DialogContent sx={{ display: "flex", flexDirection: "column" }}>
				<RaidOverview raids={raids} />
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="neutral" onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RaidManagement;
