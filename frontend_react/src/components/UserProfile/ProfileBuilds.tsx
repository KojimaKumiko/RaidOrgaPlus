import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import BuildChip from "./BuildChip";
import { deleteBuild, getBuilds, putPrefer } from "../../services/endpoints/user";
import { Build } from "models/Build";
import { Spieler } from "models/Spieler";
import AddBuild from "./AddBuild";
import { Class } from "models/Klasse";
import { Role } from "models/Rolle";
import { addBuild } from "../../services/endpoints/user";

interface IProps {
	user: Spieler;
	ownProfile: boolean;
}

const initialBuild: Build = {
	class: { abbr: "" },
	role: [{ id: 0, abbr: "" }],
	prefer: 0,
} as Build;

const ProfileBuilds = (props: IProps) => {
	const { user, ownProfile } = props;

	const [builds, setBuilds] = useState<Build[]>([]);
	const [open, setOpen] = useState(false);
	const [newBuild, setNewBuild] = useState<Build>(initialBuild);
	const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(null);

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
		let index: number;

		if (selectedRoleIndex != null) {
			index = selectedRoleIndex;
		} else {
			index = newBuild.role.findIndex((r) => r.id === 0);

			if (index === -1) {
				index = newBuild.role.length - 1;
			}
		}

		const newRoles = newBuild.role.map((r, i) => (i === index ? role : r));

		setNewBuild((build) => ({
			...build,
			role: newRoles,
		}));
	};

	const handleRoleSizeChange = (type: "add" | "remove") => {
		if (type === "add") {
			setNewBuild((build) => ({
				...build,
				role: [...build.role, { id: 0, abbr: "" } as Role],
			}));
		} else {
			setNewBuild((build) => ({
				...build,
				role: build.role.slice(0, build.role.length - 1),
			}));
		}
	};

	const handleRoleSelect = (index: number | null) => {
		setSelectedRoleIndex(index);
	};

	const buildExists = () => {
		let exists = false;

		let search = builds.filter((b) => b.class.id === newBuild.class.id);
		if (search != null && search.length > 0) {
			search.some((s) => {
				if (s.role.length === newBuild.role.length) {
					let searchRoleIds = s.role.map((r) => r.id);
					let roleIds = newBuild.role.map((r) => r.id);
					exists = roleIds.every((r) => searchRoleIds.includes(r));
					if (exists) {
						return exists;
					}
				}
			});
		}

		return exists;
	};

	const compareBuilds = (buildA: Build, buildB: Build): number => {
		if (buildA.prefer === buildB.prefer) {
			if (baseId(buildA) === baseId(buildB)) {
				if (buildA.class.id === buildB.class.id) {
					return 0;
				} else {
					return buildA.class.id < buildB.class.id ? -1 : 1;
				}
			} else {
				return baseId(buildA) < baseId(buildB) ? -1 : 1;
			}
		} else {
			return buildA.prefer > buildB.prefer ? -1 : 1;
		}
	};

	const baseId = (build: Build): number => {
		return ((build.class.id - 1) % 9) + 1;
	};

	const handleAddBuild = async () => {
		setOpen(false);
		setNewBuild(initialBuild);

		if (newBuild == null) {
			return;
		}

		if (!buildExists()) {
			const newBuilds = [...builds, newBuild];
			newBuilds.sort(compareBuilds);
			setBuilds(newBuilds);

			let roles = newBuild.role.map((r) => r.id).join(", ");
			await addBuild(newBuild.class.id, roles);
		}
	};

	const handlePrefChange = (build: Build, index: number) => async (star: number) => {
		build.prefer = star;
		const newBuilds = builds.map((b, i) => i === index ? build : b);
		newBuilds.sort(compareBuilds);
		setBuilds(newBuilds);

		let roles = build.role.map((r) => r.id).join(", ");
		await putPrefer(build.class.id, roles, star);
	}

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
					onPrefChange={handlePrefChange(build, index)}
				/>
			))}
			{ownProfile ? (
				<IconButton sx={{ backgroundColor: "#444" }} size="small" onClick={() => setOpen(true)}>
					<AddIcon />
				</IconButton>
			) : null}
			<AddBuild
				open={open}
				build={newBuild}
				onClose={handleClose}
				onClassPick={handleClassPick}
				onRolePick={handleRolePick}
				onRoleSizeChange={handleRoleSizeChange}
				onRoleSelect={handleRoleSelect}
				onAddBuild={handleAddBuild}
			/>
		</span>
	);
};

export default ProfileBuilds;
