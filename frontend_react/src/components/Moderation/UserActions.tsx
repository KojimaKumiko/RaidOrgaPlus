/** @jsxImportSource @emotion/react */
import React, { Fragment, useEffect, useState } from "react";

import {
	Box,
	Button,
	css,
	Dialog,
	Divider,
	IconButton,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Grid from "@mui/material/Unstable_Grid2";

import { User } from "models/Types";
import { InputTarget } from "../../models/types";
import { setComment as setUserComment, updateSpielerRole } from "../../services/endpoints/moderation";
import { useAppDispatch } from "../../store/hooks";
import { setComment as setStoreComment, setUserRole } from "../../store/slices/moderationSlice";
import { UserRole } from "models/Enums";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../../store/slices/userSlice";

interface Props {
	user: User;
}

const style = {
	stack: css({
		marginTop: 12,
		marginLeft: 9,
	}),
	button: css({
		borderRadius: 16,
		marginRight: 8,
	}),
	comment: css({
		width: "100%",
	}),
	saveButton: css({
		marginBottom: "auto",
	}),
	toggleButton: css({
		borderRadius: 16,
	}),
};

const EditUser = (props: Props) => {
	const [comment, setComment] = useState(props.user.comment);
	const [isDirty, setIsDirty] = useState(false);
	const [helperText, setHelperText] = useState("");

	const [role, setRole] = useState(props.user.role);

	const dispatch = useAppDispatch();

	useEffect(() => {
		const length = comment != null ? comment.length : 0;
		setHelperText(`${length} / 1000`);
		setIsDirty(comment !== props.user.comment);

		const saveComment = async () => {
			if (isDirty) {
				await setUserComment(props.user.id, comment);
				dispatch(setStoreComment({ id: props.user.id, comment: comment }));
			}
		};

		// debouncing the save here.
		const timeoutId = setTimeout(() => saveComment(), 2000);
		return () => clearTimeout(timeoutId);
	}, [comment, isDirty, props.user.comment, props.user.id, dispatch]);

	const handleChange = (e: InputTarget) => {
		if (e.value.length <= 1000) {
			setComment(e.value);
		}
	};

	const handleSave = async () => {
		await setUserComment(props.user.id, comment);
		dispatch(setStoreComment({ id: props.user.id, comment: comment }));
	};

	const disabled = useSelector(selectLoggedInUser)!.role <= UserRole.Maz;

	const handleRoleChange = async (event: React.MouseEvent<HTMLElement>, newRole: UserRole | null) => {
		if (newRole !== null) {
			setRole(newRole);
			dispatch(setUserRole({ id: props.user.id, role: newRole }));
			await updateSpielerRole(props.user.id, newRole);
		}
	};

	return (
		<Box width={600} sx={{ marginBottom: 2, marginRight: 2, marginLeft: 2 }}>
			<h3>Kommentar</h3>
			<Stack direction="row">
				<TextField
					placeholder="Kommentar"
					value={comment}
					multiline
					minRows={3}
					helperText={helperText}
					onChange={(e) => handleChange(e.target)}
					css={style.comment}
				/>
				<IconButton css={style.saveButton} disabled={!isDirty || comment.length > 1000} onClick={handleSave}>
					<SaveIcon />
				</IconButton>
			</Stack>
			<Divider sx={{ marginTop: 1 }} />
			<h3>Spieler Rang</h3>
			<ToggleButtonGroup exclusive value={role} onChange={handleRoleChange}>
				<ToggleButton css={style.toggleButton} disabled={disabled} value={UserRole.Normal}>
					Normal
				</ToggleButton>
				<ToggleButton disabled={disabled} value={UserRole.Raider}>
					Raider
				</ToggleButton>
				<ToggleButton disabled={disabled} value={UserRole.Maz}>
					MaZ
				</ToggleButton>
				<ToggleButton disabled={disabled} value={UserRole.Moderator}>
					Moderator
				</ToggleButton>
				<ToggleButton css={style.toggleButton} disabled value={UserRole.Admin}>
					Admin
				</ToggleButton>
			</ToggleButtonGroup>
		</Box>
	);
};

const GuildHistory = () => {
	return (
		<Fragment>
			<h3>Gildenhistorie</h3>
		</Fragment>
	);
};

const RoleHistory = (props: Props) => {
	const roleHistory = props.user.roleHistory;

	const getDate = (date: Date) => {
		return new Date(date).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "medium" });
	};

	return (
		<Box>
			<h3>Rolenhistorie</h3>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Art</TableCell>
							<TableCell>Datum</TableCell>
							<TableCell>Changer</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{roleHistory.map((history) => (
							<TableRow key={history.id} sx={{ "&:last-child td": { border: 0 } , "&:nth-of-type(odd)": { backgroundColor: "action.hover" } }}>
								<TableCell>{history.name}</TableCell>
								<TableCell>{history.type}</TableCell>
								<TableCell>{getDate(history.date)}</TableCell>
								<TableCell>{history.changer}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

const Archive = () => {
	return (
		<Fragment>
			<h3>Archivieren</h3>
		</Fragment>
	);
};

const Restore = () => {
	return (
		<Box>
			<h3>Wiederherstellen</h3>
		</Box>
	);
};

const UserActions = (props: Props) => {
	const [open, setOpen] = useState(false);
	const [comp, setComp] = useState("");

	const handleClose = () => {
		setOpen(false);
	};

	const handleClick = (comp: string) => {
		setComp(comp);
		setOpen(true);
	};

	const showComponent = () => {
		switch (comp) {
			case "edit":
				return <EditUser user={props.user} />;
			case "guild":
				return <GuildHistory />;
			case "role":
				return <RoleHistory user={props.user} />;
			case "archive":
				return <Archive />;
			case "restore":
				return <Restore />;
			default:
				break;
		}
	};

	const archiveButton = (
		<Button variant="contained" color="neutral" css={style.button} onClick={() => handleClick("archive")}>
			Archivieren
		</Button>
	);

	const restoreButton = (
		<Button variant="contained" color="neutral" css={style.button} onClick={() => handleClick("restore")}>
			Wiederherstellen
		</Button>
	);

	return (
		<Grid container css={style.stack} spacing={0.5}>
			<Grid>
				<Button variant="contained" color="neutral" css={style.button} disabled>
					Profile
				</Button>
			</Grid>
			<Grid>
				<Button variant="contained" color="neutral" css={style.button} onClick={() => handleClick("edit")}>
					Bearbeiten
				</Button>
			</Grid>
			<Grid>
				<Button variant="contained" color="neutral" css={style.button} onClick={() => handleClick("guild")}>
					Gildenhistorie
				</Button>
			</Grid>
			<Grid>
			<Button variant="contained" color="neutral" css={style.button} onClick={() => handleClick("role")}>
				Rolenhistorie
			</Button>
			</Grid>
			<Grid>
				{props.user.archived ? restoreButton : archiveButton}
			</Grid>
			<Dialog open={open} onClose={handleClose} maxWidth="lg">
				{showComponent()}
			</Dialog>
		</Grid>
	);
};

export default UserActions;
