import { useState } from "react";

import { Button, Stack, TextField, Snackbar } from "@mui/material";

import { changePassword } from "../../services/endpoints/user";

interface PasswordState {
	oldPassword: string;
	newPassword: string;
	repeatPassword: string;
}

type InputTarget = EventTarget & (HTMLInputElement | HTMLTextAreaElement);

const PasswordSettings = () => {
	const [passwordState, setPasswordState] = useState({} as PasswordState);
	const [passwordError, setPasswordError] = useState<string | null>("");
	const [open, setOpen] = useState(false);
	const [snackbarText, setSnackbarText] = useState("");

	const handleInput = (target: InputTarget) => {
		const { name, value } = target;
		setPasswordState({
			...passwordState,
			[name]: value,
		});

		switch (name) {
			case "newPassword":
				setPasswordError(null);
				if (passwordState.repeatPassword != null && value !== passwordState.repeatPassword) {
					setPasswordError("Die Passwörter müssen übereinstimmen");
				}
				break;
			case "repeatPassword":
				setPasswordError(null);
				if (passwordState.newPassword != null && value !== passwordState.newPassword) {
					setPasswordError("Die Passwörter müssen übereinstimmen");
				}
				break;
			default:
				break;
		}
	};

	const formValid = () => {
		return false;
	}

	const handleSubmit = async () => {
		if (passwordError || !formValid()) {
			return;
		}

		const response = await changePassword(passwordState.oldPassword, passwordState.newPassword);

		if (response) {
			setSnackbarText("Das Passwort wurde erfolgreich geändert!");
		} else {
			setSnackbarText("Das Passwort ist falsch.");
		}

		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setSnackbarText("");
	};

	return (
		<Stack spacing={1}>
			<h3>Passwort ändern</h3>
			<TextField
				label="Altes Passwort"
				type="password"
				name="oldPassword"
				onChange={(e) => handleInput(e.target)}
			/>
			<TextField
				label="Neues Passwort"
				type="password"
				name="newPassword"
				onChange={(e) => handleInput(e.target)}
			/>
			<TextField
				label="Neues Passwort wiederholen"
				type="password"
				name="repeatPassword"
				onChange={(e) => handleInput(e.target)}
				{...(passwordError && { error: true, helperText: passwordError })}
			/>
			<Button variant="contained" color="neutral" onClick={handleSubmit} sx={{ "&&": { marginRight: "auto" } }}>
				Passwort Aktualisieren
			</Button>
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

export default PasswordSettings;
