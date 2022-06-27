import { useState } from "react";

import { Button, Snackbar, TextField } from "@mui/material";
import { Stack, Tooltip } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

import { setApiKey } from "../../services/endpoints/user";

const ApiKeySettings = () => {
	const [key, setKey] = useState("");
	const [snackbarText, setSnackbarText] = useState("");
	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | null>("");
	const regex = /[A-Z\d]{8}-([A-Z\d]{4}-){3}[A-Z\d]{20}-([A-Z\d]{4}-){3}[A-Z\d]{12}/;

	const handleClick = async () => {
		if (error != null) {
			return;
		}

		const response = await setApiKey(key);

		switch (response) {
			case "Success":
				setSnackbarText("Der API-Key wurde erfolgreich gesetzt/geändert.");
				break;
			case "Permissions":
				setSnackbarText("Fehlende Berechtigungen für den API-Key (siehe ?-Tooltip)");
				break;
			case "Wrong account":
				setSnackbarText("Der API-Key gehört nicht zu deinem Account!");
				break;
			default:
				setSnackbarText("Ein Fehler ist aufgetreten.");
				break;
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInput = (value: string) => {
		setKey(value);
		setError(null);

		if (!value) {
			return;
		}

		if (!regex.test(value)) {
			setError("Bitte gib einen gültigen API-Key an");
			return;
		}
	};

	const tooltip = "Benötigt: account, builds, characters, inventories, progression, unlocks";
	return (
		<Stack>
			<h3>API-Key hinzufügen oder ändern</h3>
			<TextField
				label="Neuer API-Key"
				onChange={(e) => handleInput(e.target.value)}
				{...(error && { error: true, helperText: error })}
			/>
			<Stack direction="row" alignItems="center" spacing={2} sx={{ marginTop: 2 }}>
				<Button variant="contained" color="neutral" onClick={handleClick}>
					API-Key Aktualisieren
				</Button>
				<Tooltip title={tooltip} arrow placement="right">
					<HelpIcon />
				</Tooltip>
			</Stack>
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
				message={snackbarText}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			/>
		</Stack>
	);
};

export default ApiKeySettings;
