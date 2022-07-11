import BuildChip from "./BuildChip";

import { Build } from "models/Build";
import { CLASSES } from "models/Klasse";
import { ROLES } from "models/Rolle";

const ProfileBuilds = () => {
	const build: Build = {
		class: CLASSES.find(c => c.name === "Weaver")!,
		role: [ ROLES[0], ROLES[1] ],
		prefer: 0
	}

	return (
		<span>
			<h3>Meine Builds</h3>
			<BuildChip ownProfile star edit build={build} />
		</span>
	);
}

export default ProfileBuilds;