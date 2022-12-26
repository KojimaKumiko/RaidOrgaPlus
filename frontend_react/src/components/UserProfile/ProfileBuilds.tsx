import BuildChip from "./BuildChip";

import { Build } from "models/Build";
import { useEffect, useState } from "react";
import { Spieler } from "models/Spieler";
import { deleteBuild, getBuilds } from "../../services/endpoints/user";

interface IProps {
	user: Spieler;
}

const ProfileBuilds = (props: IProps) => {
	const [builds, setBuilds] = useState<Build[]>([]);

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
		let roles = build.role.map(r => r.id).join(', ');
		await deleteBuild(build.class.id, roles);
		setBuilds(builds.filter((b, i) => i !== index));
	}

	return (
		<span>
			<h3>Meine Builds</h3>
			{builds.map((build, index) => (
				<BuildChip ownProfile star edit build={build} key={generateKey(build)} onDelete={() => handleDelete(build, index)} />
			))}
		</span>
	);
};

export default ProfileBuilds;
