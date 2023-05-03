import { useEffect, useState } from "react";

import { Box, Button, IconButton, Stack, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { User } from "../../../../models/Types";
import { InputTarget } from "../../models/types";

interface IProps {
	user: User;
	ownProfile: boolean;
}

const ProfileName = (props: IProps) => {
	const { user, ownProfile } = props;

	const [edit, setEdit] = useState(false);

	const handleEdit = () => {
		setEdit(true);
	};

	const handleSave = () => {
		setEdit(false);
	};

	const Name = () => {
		return (
			<Stack direction="row">
				<p style={{ fontSize: 24 }}>
					{user.name} ({user.accname})
				</p>
				{ownProfile ? (
					<IconButton onClick={handleEdit}>
						<EditIcon />
					</IconButton>
				) : null}
			</Stack>
		);
	};

	const Form = () => {
		const [name, setName] = useState(user.name);
		const [helperText, setHelperText] = useState("");

		useEffect(() => {
			const length = name != null ? name.length : 0;
			setHelperText(`${length} / 50`);
		}, [name]);

		const handleChange = (e: InputTarget) => {
			setName(e.value);
		};

		return (
			<Stack>
				<TextField
					label="Anzeigename"
					inputProps={{ maxLength: 50 }}
					onChange={(e) => handleChange(e.target)}
					helperText={helperText}
					value={name}
					sx={{ width: 650 }}
				/>
				<Button
					onClick={handleSave}
					variant="contained"
					color="neutral"
					sx={{ marginRight: "auto", marginTop: 1 }}>
					Speichern
				</Button>
			</Stack>
		);
	};

	return <Box>{!edit ? <Name /> : <Form />}</Box>;
};

export default ProfileName;
