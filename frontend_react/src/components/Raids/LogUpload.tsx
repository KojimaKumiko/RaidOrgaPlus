import { useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Stack,
	TextField,
	Typography,
} from "@mui/material";

import { InputTarget } from "../../models/types";
import { userRaid } from "models/Types";
import { generateUserToken, setUserToken } from "../../services/endpoints/raids";

interface ILogUploadProps {
	raid: userRaid;
}

const LogUpload = (props: ILogUploadProps) => {
	const { raid } = props;

	const [token, setToken] = useState(raid.dpsReportToken);
	const [tokenSaved, setTokenSaved] = useState(false);
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (e: InputTarget) => {
		setToken(e.value);
		setTokenSaved(false);
	};

	const handleGenerateToken = async () => {
		const response = await generateUserToken(raid.id);
		if (response.success) {
			setToken(response.token);
			setTokenSaved(true);
		}
	};

	const handleSave = async () => {
		if (!tokenSaved && token != null && token.trim() != null) {
			await setUserToken(raid.id, token);
		}

		setOpen(false);
	};

	return (
		<Box>
			<h2>Log Upload</h2>
			<Divider sx={{ borderWidth: "thick 0 0 0", mb: "20px" }} />
			<Typography sx={{ mb: 2 }}>
				Für die Seite dps.report gibt es die Möglichkeit, beim hochladen von Logs einen User Token mit
				anzugeben. Mit diesem User Token, können frühere Logs die auf der Seite mit dem Token hochgeladen
				wurden, abgefragt werden. RO+ bietet die Möglichkeit an, einen solchen User Token für einen Raid zu
				hinterlegen oder auch einen automatisch generieren zu lassen, welcher dann auch für die Uploads der Logs
				entsprechend verwendet wird. Das hinterlegen eines User Tokens in RO+ ist freiwilig, wird aber empfohlen
				um z.B. später auch direkt über dps.report auf die Logs zugreifen zu können.
			</Typography>
			<Button variant="contained" color="neutral" onClick={handleClick}>
				User Token
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>DPS Report - User Token</DialogTitle>
				<DialogContent>
					<Stack>
						<TextField
							label="User Token"
							margin="dense"
							onChange={(e) => handleChange(e.target)}
							value={token}
						/>
						<Button variant="contained" color="neutral" onClick={handleGenerateToken} sx={{ mt: 2 }}>
							Generate User Token
						</Button>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" color="neutral" onClick={handleClose}>
						Close
					</Button>
					<Button variant="contained" color="neutral" onClick={handleSave}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default LogUpload;
