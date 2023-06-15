import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Spieler } from "models/Spieler";

interface IPlayerNameProps {
	user: Spieler;
	truncate?: boolean;
	clickable?: boolean;
}

const PlayerName = (props: IPlayerNameProps) => {
	const { user, truncate, clickable } = props;

	const [entered, setEntered] = useState(false);
	const navigate = useNavigate();

	const showName = () => {
		if (!entered) {
			return user.name;
		}

		if (!truncate) {
			return user.accname;
		}

		const baseName = user.accname.split(".")[0];
		if (baseName.length > 15) {
			return `${baseName.slice(0, 12)}...`;
		} else {
			return baseName;
		}
	};

	const handleClick = () => {
		if (!clickable || user.id <= 1) {
			return;
		}

		navigate(`/profile/${user.id}`);
	}

	return (
		<span onMouseEnter={() => setEntered(true)} onMouseLeave={() => setEntered(false)} onClick={handleClick}>
			{showName()}
		</span>
	);
};

export default PlayerName;
