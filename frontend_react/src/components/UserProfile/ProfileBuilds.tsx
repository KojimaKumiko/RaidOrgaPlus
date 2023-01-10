import { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import { Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';

import BuildChip from "./BuildChip";
import { deleteBuild, getBuilds } from "../../services/endpoints/user";
import { Build } from "models/Build";
import { Spieler } from "models/Spieler";
import AddBuild from "./AddBuild";

interface IProps {
	user: Spieler;
}

const ProfileBuilds = (props: IProps) => {
	const [builds, setBuilds] = useState<Build[]>([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const getBuildsForUser = async () => {
			setBuilds(await getBuilds(props.user.id));
		};

		getBuildsForUser().catch(console.error);
	}, [props.user.id]);

	const generateKey = (build: Build) => {
		let roleIds = 0;
		if (build.role && build.role.length > 0) {
			build.role.forEach((r) => (roleIds += r.id));
		}
		return `${build.class.name}_${roleIds}_${build.class.id}`;
	};

	const handleDelete = async (build: Build, index: number) => {
		let roles = build.role.map((r) => r.id).join(", ");
		await deleteBuild(build.class.id, roles);
		setBuilds(builds.filter((b, i) => i !== index));
	};

	const handleClose = () => {
		setOpen(false);
	}

	return (
		<span>
			<h3>Meine Builds</h3>
			{builds.map((build, index) => (
				<BuildChip
					ownProfile
					star
					build={build}
					key={generateKey(build)}
					onDelete={() => handleDelete(build, index)}
				/>
			))}
			<IconButton sx={{ backgroundColor: "#444" }} size="small" onClick={() => setOpen(true)}>
				<AddIcon />
			</IconButton>
			<Dialog open={open} maxWidth="xs">
				<DialogTitle>
					<Stack direction="row" justifyContent="space-between">
						<Typography>Build Hinzufügen</Typography>
						<HelpOutlinedIcon />
					</Stack>
				</DialogTitle>
				<DialogContent dividers>
					<AddBuild />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Abbr.</Button>
					<Button>Hinzufügen</Button>
				</DialogActions>
			</Dialog>
		</span>
	);
};

export default ProfileBuilds;
