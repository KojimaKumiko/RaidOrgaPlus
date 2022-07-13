import BuildChip from "./BuildChip";

import { Build } from "models/Build";
import { useEffect, useState } from "react";
import { Spieler } from "models/Spieler";
import { getBuilds } from "../../services/endpoints/user";

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

	return (
		<span>
			<h3>Meine Builds</h3>
			{builds.map((b) => (
				<BuildChip ownProfile star edit build={b} key={generateKey(b)} />
			))}
		</span>
	);
};

export default ProfileBuilds;
