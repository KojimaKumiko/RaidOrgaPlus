import { ChangeEvent, useEffect, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Stack,
	TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { ExtraAccount } from "models/ExtraAccount";
import { addExtraAccount, deleteExtraAccount, getExtraAccounts } from "../../services/endpoints/user";

const ExtraAccounts = () => {
	const [accounts, setAccounts] = useState<ExtraAccount[]>([]);
	const [open, setOpen] = useState(false);
	const [accName, setAccName] = useState("");
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState("");

	useEffect(() => {
		const getExtraAccountsData = async () => {
			const extraAccounts = await getExtraAccounts();
			setAccounts(extraAccounts);
		};

		getExtraAccountsData().catch(console.error);
	}, []);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputValue = (event: React.FocusEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setAccName(value);
		const check = /^[a-zA-Z\s]+\.\d{4}$/.test(value);
		if (!check && value !== "") {
			setError(true);
			setHelperText("Bitte gib deinen Accountnamen an.");
		} else {
			setError(false);
			setHelperText("");
		}
	};

	const handleKeyDown = (key: string) => {
		if (key === "Enter") {
			handleAddAccount();
		}
	};

	const handleAddAccount = async () => {
		if (error) {
			return;
		}

		const extraAccount = await addExtraAccount(accName);
		setAccounts([...accounts, { accName: accName, id: extraAccount.id }]);
		setAccName("");
	};

	const handleDeleteAccount = async (account: ExtraAccount) => {
		await deleteExtraAccount(account.id);

		setAccounts(accounts.filter((a) => a.id !== account.id));
	};

	return (
		<Box>
			<Button onClick={handleClick} variant="contained" color="neutral" sx={{ mt: 1.5, mb: 0.5 }}>
				Extra Accounts
			</Button>
			<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
				<DialogTitle>Extra Accounts</DialogTitle>
				<DialogContent>
					<List>
						{accounts.map((account) => (
							<ListItem
								key={account.id}
								secondaryAction={
									<IconButton edge="end" onClick={() => handleDeleteAccount(account)}>
										<DeleteIcon />
									</IconButton>
								}>
								<ListItemText primary={account.accName} />
							</ListItem>
						))}
					</List>
					<Stack direction="row">
						<TextField
							variant="standard"
							required
							fullWidth
							label="Accountname"
							value={accName}
							error={error}
							helperText={helperText}
							onBlur={handleInputValue}
							onChange={handleInputValue}
							onKeyDown={(e) => handleKeyDown(e.key)}
						/>
						<IconButton onClick={handleAddAccount} sx={{ height: "fit-content", mt: "auto", ml: 1 }}>
							<AddIcon />
						</IconButton>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default ExtraAccounts;
