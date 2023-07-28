import { useEffect, useState } from "react";
import {
	Autocomplete,
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	Box,
	Button,
	Dialog,
	DialogContent,
	Divider,
	FilterOptionsState,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

import PlayerName from "../Misc/PlayerName";
import { Spieler } from "models/Spieler";
import { listPlayers, setLieutenantRole } from "../../services/endpoints/raids";

interface ILieutenantsProps {
	raidId: number;
	disabled: boolean;
}

const Lieutenants = (props: ILieutenantsProps) => {
	const { raidId, disabled } = props;

	const [players, setPlayers] = useState<Spieler[]>([]);
	const [lieutenants, setLieutenants] = useState<Spieler[]>([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const abortController = new AbortController();

		const getData = async () => {
			try {
				const playerList = await listPlayers(raidId, abortController.signal);
				setPlayers(playerList.filter((p) => p.role < 2));
				setLieutenants(playerList.filter((p) => p.role === 1));
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
	}, []);

	const removeLieutenant = async (lieutenant: Spieler) => {
		await setLieutenantRole(raidId, lieutenant.id, 0);
		setLieutenants(lieutenants.filter((l) => l.id !== lieutenant.id));
	};

	const handleAddLieutenants = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const getDefaultValues = () => {
		return players.filter((p) => lieutenants.find((l) => l.id === p.id));
	};

	const handleValueChange = async (
		event: any,
		value: Spieler[],
		reason: AutocompleteChangeReason,
		details: AutocompleteChangeDetails<Spieler> | undefined
	) => {
		const spielerId = details?.option.id;

		switch (reason) {
			case "selectOption":
				await setLieutenantRole(raidId, Number(spielerId), 1);
				break;
			case "removeOption":
				await setLieutenantRole(raidId, Number(spielerId), 0);
				break;
			default:
				break;
		}

		setLieutenants(value.map(p => p));
	};

	const renderOption = (props: any, option: Spieler, state: any) => {
		return (
			<li {...props}>
				<PlayerName user={option} />
			</li>
		);
	}

	const filterOptions = (options: Spieler[], state: FilterOptionsState<Spieler>) => {
		const inputValue = state.inputValue.toLowerCase();
		return options.filter(s => s.accname.toLowerCase().indexOf(inputValue) > -1 || s.name.toLowerCase().indexOf(inputValue) > -1);
	}

	return (
		<Box>
			<h2>Lieutenants</h2>
			<Divider sx={{ borderWidth: "thick 0 0 0", mb: "20px" }} />
			<Typography sx={{ mb: 2 }}>
				Lieutenants haben in etwa die gleichen Rechte wie Raid Leader: Sie können einen neuen Termin erstellen,
				diesen Archivieren oder Löschen, die Aufstellung bearbeiten etc.
				<br />
				Lieutenants können jedoch nicht Spieler aus dem Raid kicken, Spieler in den Raid einladen oder weitere
				Lieutenants ernennen. Außerdem ist die Anzahl an Lieutenants auf 2 pro Raid beschränkt.
			</Typography>
			<span>
				Lieutenants:
				<ul style={{ marginLeft: "12px" }}>
					{lieutenants.map((player) => (
						<span key={player.id} style={{ display: "flex", alignItems: "center" }}>
							<li style={{ minWidth: "200px" }}>
								<PlayerName user={player} />
							</li>
							{!disabled ? (
								<IconButton onClick={() => removeLieutenant(player)}>
									<DeleteIcon />
								</IconButton>
							) : null}
						</span>
					))}
				</ul>
			</span>
			<Button variant="contained" color="neutral" onClick={handleAddLieutenants}>
				Lieutenants
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<Autocomplete
						multiple
						filterSelectedOptions
						sx={{ width: 300 }}
						options={players}
						defaultValue={getDefaultValues()}
						onChange={handleValueChange}
						getOptionLabel={(option) => option.accname}
						renderOption={renderOption}
						filterOptions={filterOptions}
						renderInput={(params) => <TextField {...params} margin="dense" label="Eingeladene Spieler" />}
					/>
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default Lieutenants;
