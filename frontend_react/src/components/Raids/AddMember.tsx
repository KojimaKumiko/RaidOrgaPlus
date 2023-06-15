import { useEffect, useState } from "react";
import {
	Autocomplete,
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FilterOptionsState,
	TextField,
} from "@mui/material";

import { Spieler } from "models/Spieler";
import {
	deleteInviteAsLead,
	invitablePlayers,
	invitePlayer,
	pendingInvitesForRaid,
} from "../../services/endpoints/raids";
import axios from "axios";
import PlayerName from "../Misc/PlayerName";

interface IAddMemberProps {
	open: boolean;
	raidId: number;
	onClose: () => void;
}

const AddMember = (props: IAddMemberProps) => {
	const { open, raidId, onClose } = props;

	const [invitePlayers, setInvitePlayers] = useState<Spieler[]>([]);
	const [invited, setInvited] = useState<number[]>([]);
	useEffect(() => {
		const abortController = new AbortController();

		const getData = async () => {
			try {
				const players = await invitablePlayers(raidId, abortController.signal);
				setInvitePlayers(players);

				const pendingInvites = await pendingInvitesForRaid(raidId, abortController.signal);
				setInvited(pendingInvites);
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

	const getDefaultValues = () => {
		return invitePlayers.filter((p) => invited.find((i) => i === p.id));
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
				await invitePlayer(raidId, spielerId);
				break;
			case "removeOption":
				await deleteInviteAsLead(raidId, spielerId);
				break;
			default:
				break;
		}

		setInvited(value.map(p => p.id));
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
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Spieler Einladen</DialogTitle>
			<DialogContent>
				<Autocomplete
					multiple
					filterSelectedOptions
					sx={{ width: 300 }}
					options={invitePlayers}
					defaultValue={getDefaultValues()}
					onChange={handleValueChange}
					getOptionLabel={(option) => option.accname}
					renderOption={renderOption}
					filterOptions={filterOptions}
					renderInput={(params) => <TextField {...params} margin="dense" label="Eingeladene Spieler" />}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="error" variant="contained">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddMember;
