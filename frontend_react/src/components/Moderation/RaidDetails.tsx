import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
	TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
// import { FixedSizeList, ListChildComponentProps } from "react-window";

import ProfileAvatar from "../UserProfile/ProfileAvatar";
import { ModRaid } from "models/Raid";
import { Spieler } from "models/Spieler";
import { User } from "models/Types";
import {
	addSpieler,
	getSpielerForRaid,
	invitablePlayers,
	removeRaid,
	removeSpieler,
	setPlayerRole,
} from "../../services/endpoints/moderation";

// const renderRow = (props: ListChildComponentProps) => {
// 	const { index, style } = props;
// 	const data: Spieler[] = props.data;

// 	return (
// 		<ListItem style={style} key={index} component="div" disablePadding>
// 			<ListItemButton>
// 				<ListItemText primary={data[index].name} secondary={data[index].accname} />
// 			</ListItemButton>
// 		</ListItem>
// 	);
// };

interface IProps {
	raid: ModRaid;
	refreshRaids: () => Promise<void>;
}

const RaidDetails = (props: IProps) => {
	const { raid } = props;

	const [spieler, setSpieler] = useState<Spieler[]>(raid.spieler);
	const [invitePlayers, setInvitePlayers] = useState<Spieler[]>([]);
	useEffect(() => {
		const fetchInvPlayers = async () => {
			const invPlayers = await invitablePlayers(raid.id);

			setInvitePlayers(invPlayers);
		};

		fetchInvPlayers().catch(console.error);
	}, [raid.id]);
	const [filteredPlayers, setFilteredPlayers] = useState<Spieler[]>(invitePlayers);
	const [filter, setFilter] = useState("");
	useEffect(() => {
		filterPlayers(filter);
	}, [filter, invitePlayers]);

	const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
	const [removeRaidDialogOpen, setRemoveRaidDialogOpen] = useState(false);

	const handleClickAddPlayerOpen = () => {
		setPlayerDialogOpen(true);
		setFilteredPlayers(invitePlayers);
	};

	const handleClickRemoveRaidOpen = () => {
		setRemoveRaidDialogOpen(true);
	};

	const handleClose = () => {
		setPlayerDialogOpen(false);
		setRemoveRaidDialogOpen(false);
	};

	const handleRemoveRaid = async () => {
		await removeRaid(raid.id, raid.name);
		await props.refreshRaids();
	};

	const refreshPlayers = async () => {
		setSpieler(await getSpielerForRaid(raid.id));
	};

	const refreshInvitablePlayers = async () => {
		const invPlayers = await invitablePlayers(raid.id);
		setInvitePlayers(invPlayers);
	};

	const changePlayerRole = async (spieler: Spieler) => {
		const role = spieler.role === 2 ? 0 : 2;
		await setPlayerRole(raid.id, spieler.id, role, spieler.accname);
		await refreshPlayers();
		await props.refreshRaids();
	};

	const kickPlayer = async (spieler: Spieler) => {
		await removeSpieler(raid.id, raid.name, spieler.id, spieler.accname);
		await refreshPlayers();
		await refreshInvitablePlayers();
	};

	const filterPlayers = (filterText: string) => {
		const filtered = invitePlayers.filter((p) => isInNameFilter(p, filterText));
		setFilteredPlayers(filtered);
		setFilter(filterText);
	};

	const isInNameFilter = (user: Spieler, filterText: string) => {
		const name = user.name.toLowerCase();
		const accname = user.accname.toLowerCase();
		const searchText = filterText.toLowerCase();

		return name.indexOf(searchText) > -1 || accname.indexOf(searchText) > -1;
	};

	const addPlayer = async (spieler: Spieler) => {
		await addSpieler(raid.id, spieler.id, spieler.accname, raid.name);
		await refreshPlayers();
		await refreshInvitablePlayers();
	};

	return (
		<Box>
			<Stack direction="row">
				<Button
					variant="contained"
					color="success"
					sx={{ color: "white", mr: 1 }}
					onClick={handleClickAddPlayerOpen}>
					Spieler hinzufügen
				</Button>
				<Button
					variant="contained"
					color="error"
					disabled={spieler.length > 0}
					onClick={handleClickRemoveRaidOpen}>
					Raid entfernen
				</Button>
			</Stack>
			<PlayerList spieler={spieler} changePlayerRole={changePlayerRole} kickPlayer={kickPlayer} />
			<AddPlayerDialog
				open={playerDialogOpen}
				onClose={handleClose}
				filteredPlayers={filteredPlayers}
				filterPlayers={filterPlayers}
				addPlayer={addPlayer}
			/>
			<RemoveRaidDialog open={removeRaidDialogOpen} raidName={raid.name} onClose={handleClose} handleRemoveRaid={handleRemoveRaid} />
		</Box>
	);
};

interface IPlayerListProps {
	spieler: Spieler[];
	changePlayerRole: (s: Spieler) => void;
	kickPlayer: (s: Spieler) => void;
}

const PlayerList = (props: IPlayerListProps) => {
	const { spieler, changePlayerRole, kickPlayer } = props;

	const promoteDemoteIcon = (spieler: Spieler) => {
		if (spieler.role === 2) {
			return <StarIcon />;
		} else {
			return <StarOutlineIcon />;
		}
	};

	return (
		<List>
			{spieler.map((s) => (
				<ListItem key={s.id}>
					<ListItemAvatar>
						<ProfileAvatar
							user={s as User}
							sx={{
								marginRight: 2,
							}}
						/>
					</ListItemAvatar>
					<ListItemText primary={s.name} secondary={s.accname} />
					<ListItemSecondaryAction>
						<IconButton onClick={() => changePlayerRole(s)}>{promoteDemoteIcon(s)}</IconButton>
						<IconButton onClick={() => kickPlayer(s)}>
							<ClearIcon color="error" />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
};

interface IAddPlayerDialog {
	open: boolean;
	filteredPlayers: Spieler[];
	onClose: () => void;
	filterPlayers: (filter: string) => void;
	addPlayer: (player: Spieler) => void;
}

const AddPlayerDialog = (props: IAddPlayerDialog) => {
	const { open, filteredPlayers, onClose, filterPlayers, addPlayer } = props;

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Spieler Hinzufügen</DialogTitle>
			<DialogContent sx={{ height: 500 }}>
				<TextField
					variant="outlined"
					label="Suche nach Spielern"
					onChange={(e) => filterPlayers(e.currentTarget.value)}
					margin="dense"
				/>
				{/* <FixedSizeList
						height={400}
						width={320}
						itemSize={72}
						itemCount={filteredPlayers.length}
						itemData={filteredPlayers}
						overscanCount={5}>
						{renderRow}
					</FixedSizeList> */}
				{filteredPlayers.map((p) => (
					<ListItem key={p.id}>
						<ListItemButton onClick={() => addPlayer(p)}>
							<ListItemText primary={p.name} secondary={p.accname} />
						</ListItemButton>
					</ListItem>
				))}
			</DialogContent>
		</Dialog>
	);
};

interface IRemoveRaidDialog {
	open: boolean;
	raidName: string;
	onClose: () => void;
	handleRemoveRaid: () => Promise<void>;
}

const RemoveRaidDialog = (props: IRemoveRaidDialog) => {
	const { open, raidName, onClose, handleRemoveRaid } = props;

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Raid Löschen</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Bist du dir sicher das du den Raid <span style={{ fontWeight: "bold" }}>{raidName}</span> Löschen
					möchtest?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Nein</Button>
				<Button onClick={handleRemoveRaid}>Ja</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RaidDetails;
