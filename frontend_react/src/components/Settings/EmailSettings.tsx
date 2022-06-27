import { useState } from "react";

import { Button, Stack, TextField, Snackbar } from "@mui/material";

import { changeEmail } from "../../services/endpoints/user";

type InputTarget = EventTarget & (HTMLInputElement | HTMLTextAreaElement);

const EmailSettings = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState<string | null>("");
	const [open, setOpen] = useState(false);
	const [snackbarText, setSnackbarText] = useState("");

	const emailRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)+$/;

	const handleInput = (target: InputTarget) => {
		const { name, value } = target;

		if (name === "email") {
			setEmail(value);
			setEmailError(null);
			if (!value) {
				return;
			}

			if (!emailRegex.test(value)) {
				setEmailError("Bitte gib eine gültige E-Mail-Adresse an");
			}
		} else if (name === "password") {
			setPassword(value);
		}
	};

	const handleSubmit = async () => {
		if (emailError || !password || !email) {
			return;
		}

		const response = await changeEmail(email, password);
		if (response) {
			setSnackbarText("Die E-Mail wurde erfolgreich geändert!");
		} else {
			setSnackbarText("Das Passwort ist falsch!");
		}

		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setSnackbarText("");
	};

	const formValid = () => {
		return emailError == null && email != null && password != null;
	};

	return (
		<Stack spacing={1}>
			<h3>E-Mail Adresse ändern</h3>
			<TextField
				label="Neue E-Mail Adresse"
				name="email"
				onChange={(e) => handleInput(e.target)}
				{...(emailError && { error: true, helperText: emailError })}
			/>
			<TextField label="Passwort bestätigen" name="password" onChange={(e) => handleInput(e.target)} />
			<Button
				variant="contained"
				color="neutral"
				onClick={handleSubmit}
				sx={{ "&&": { marginRight: "auto" } }}
				disabled={!formValid()}>
				E-Mail Aktualisieren
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

export default EmailSettings;
