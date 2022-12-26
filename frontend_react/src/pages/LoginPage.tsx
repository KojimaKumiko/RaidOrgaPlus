import { useState } from "react";

import { Box, TextField, FormGroup, FormControlLabel, Checkbox, Button, Snackbar } from "@mui/material";

import { login as loginUser } from "../services/endpoints/user";
import { setCookie } from "../services/cookies";
import Spinner from "../components/Spinner";

const initialFormValues = {
	accountName: "",
	password: "",
	repeatPassword: "",
	email: "",
	name: "",
	formSubmitted: false,
	success: false,
};

const useFormControls = () => {
	const [values, setValues] = useState(initialFormValues);
	const [errors, setErrors] = useState({} as any);
	const validate = (fieldValues: any = values) => {
		let temp: any = { ...errors };

		if ("accountName" in fieldValues) {
			temp.accountName = fieldValues.accountName ? "" : "Bitte gib deinen Accountnamen an.";
			if (fieldValues.accountName) {
				temp.accountName = /^[a-zA-Z\s]+\.\d{4}$/.test(fieldValues.accountName)
					? ""
					: "Bitte gib einen gültigen Accountnamen an.";
			}
		}

		if ("name" in fieldValues) {
			temp.name = fieldValues.name ? "" : "Bitte gib deinen Anzeigenamen an.";
		}

		if ("email" in fieldValues) {
			temp.email = fieldValues.email ? "" : "Bitte gib eine E-Mail-Adresse an.";
			if (fieldValues.email) {
				temp.email =
					/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)+$/.test(
						fieldValues.email
					)
						? ""
						: "Bitte gib eine gültige E-Mail-Adresse an.";
			}
		}

		if ("password" in fieldValues) {
			temp.password = fieldValues.password ? "" : "Bitte gib dein Passwort an";
		}

		if ("repeatPassword" in fieldValues) {
			temp.repeatPassword =
				fieldValues.repeatPassword === values.password ? "" : "Passwörter müssen übereinstimmen!";
		}

		setErrors({ ...temp });
	};

	const handleInputValue = (e: EventTarget & (HTMLInputElement | HTMLTextAreaElement)) => {
		const { name, value } = e;
		setValues({
			...values,
			[name]: value,
		});
		validate({ [name]: value });
	};

	const handleFormSubmit = async (cb: (fieldValues: typeof values) => void) => {
		cb(values);
	};

	const formIsValid = (registerMode: boolean, fieldValues = values) => {
		let isValid: boolean =
			!!fieldValues.accountName && !!fieldValues.password && !!Object.values(errors).every((x) => x === "");

		if (registerMode) {
			isValid = isValid && !!fieldValues.email && !!fieldValues.name && !!fieldValues.repeatPassword;
		}

		return isValid;
	};

	return { handleInputValue, handleFormSubmit, formIsValid, errors };
};

const LoginPage = () => {
	const [registerMode, setRegisterMode] = useState(false);
	const [buttonText, setButtonText] = useState("Anmelden");
	const [loading, setLoading] = useState(false);
	const [snackbarText, setSnackbarText] = useState("");
	const [open, setOpen] = useState(false);
	const { handleInputValue, errors, formIsValid, handleFormSubmit } = useFormControls();

	const inputFieldValues = [
		{
			name: "accountName",
			label: "Accountname",
			id: "account-name",
			type: "text",
		},
		{
			name: "name",
			label: "Anzeigename",
			id: "name",
			type: "text",
			registerMode: true,
		},
		{
			name: "email",
			label: "E-Mail-Adresse",
			id: "email",
			type: "text",
			registerMode: true,
		},
		{
			name: "password",
			label: "Passwort",
			id: "password",
			type: "password",
		},
		{
			name: "repeatPassword",
			label: "Passwort wiederholen",
			id: "repeat-password",
			type: "password",
			registerMode: true,
		},
	];

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.checked;
		setRegisterMode(value);

		if (value) {
			setButtonText("Registrieren");
		} else {
			setButtonText("Anmelden");
		}
	};

	const handleClick = async () => {
		setLoading(true);
		handleFormSubmit(values => {
			if (registerMode) {
			} else {
				login(values.accountName, values.password);
			}
		});
	};

	const handleKeyDown = (key: string) => {
		if (key === "Enter" && formIsValid(registerMode)) {
			handleClick();
		}
	}

	const login = async (accname: string, password: string) => {
		const response = await loginUser(accname, password);

		if (response === "wrongUsername") {
			setSnackbarText("Der Accountname ist falsch!");
			setOpen(true);
		} else if (response === "wrongPassword") {
			setSnackbarText("Das Passwort ist falsch!");
			setOpen(true);
		} else {
			setCookie("session", response);
			window.location.href = "/";
		}
		
		setLoading(false);
	};

	const handleClose = () => {
		setOpen(false);
	}

	return (
		<Box component="form" sx={{ "& .MuiTextField-root": { m: 1 }, padding: (theme) => theme.spacing(3) }} noValidate autoComplete="off">
			{inputFieldValues.map((value, index) => {
				const styles = [value.registerMode && !registerMode && { display: "none" }];
				return (
					<TextField
						required
						fullWidth
						variant="standard"
						key={index}
						name={value.name}
						label={value.label}
						type={value.type}
						sx={styles}
						onBlur={(e) => handleInputValue(e.target)}
						onChange={(e) => handleInputValue(e.target)}
						onKeyDown={(e) => handleKeyDown(e.key)}
						{...(errors[value.name] && { error: true, helperText: errors[value.name] })}
					/>
				);
			})}
			<Button variant="text" onClick={handleClick} disabled={!formIsValid(registerMode)}>
				{buttonText}
			</Button>
			<FormGroup>
				<FormControlLabel
					control={<Checkbox checked={registerMode} onChange={handleChange} />}
					label="Neu registrieren?"
				/>
			</FormGroup>
			<Spinner loading={loading} />
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
				message={snackbarText}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			/>
		</Box>
	);
};

export default LoginPage;
