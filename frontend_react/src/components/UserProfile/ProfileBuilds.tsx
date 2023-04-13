import { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";

import BuildChip from "./BuildChip";
import { deleteBuild, getBuilds } from "../../services/endpoints/user";
import { Build } from "models/Build";
import { Spieler } from "models/Spieler";
import AddBuild from "./AddBuild";
import { Class } from "models/Klasse";
import { Role } from "models/Rolle";

interface IProps {
	user: Spieler;
	ownProfile: boolean;
}

const ProfileBuilds = (props: IProps) => {
	const { user, ownProfile } = props;

	const [builds, setBuilds] = useState<Build[]>([]);
	const [open, setOpen] = useState(false);
	const [newBuild, setNewBuild] = useState<Build>({
		class: { abbr: "" },
		role: [{ id: 0, abbr: "" }],
		prefer: 0,
	} as Build);

	useEffect(() => {
		const getBuildsForUser = async () => {
			setBuilds(await getBuilds(user.id));
		};

		getBuildsForUser().catch(console.error);
	}, [user.id]);

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
	};

	const handleClassPick = (pick: Class) => {
		setNewBuild((build) => ({
			...build,
			class: pick,
		}));
	};

	const handleRolePick = (role: Role) => {
		let index = newBuild.role.findIndex((r) => r.id === 0);
		if (index === -1) {
			index = newBuild.role.length - 1;
		}
		const newRoles = newBuild.role.map((r, i) => (i === index ? role : r));

		setNewBuild((build) => ({
			...build,
			role: newRoles,
		}));
	};

	return (
		<span>
			<h3>Meine Builds</h3>
			{builds.map((build, index) => (
				<BuildChip
					ownProfile={ownProfile}
					star
					build={build}
					key={generateKey(build)}
					onDelete={() => handleDelete(build, index)}
				/>
			))}
			{ownProfile ? (
				<IconButton sx={{ backgroundColor: "#444" }} size="small" onClick={() => setOpen(true)}>
					<AddIcon />
				</IconButton>
			) : null}
			<Dialog open={open} maxWidth="xs">
				<DialogTitle>
					<Stack direction="row" justifyContent="space-between">
						<Typography>Build Hinzufügen</Typography>
						<HelpOutlinedIcon />
					</Stack>
				</DialogTitle>
				<DialogContent dividers>
					<AddBuild build={newBuild} onClassPick={handleClassPick} onRolePick={handleRolePick} />
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
