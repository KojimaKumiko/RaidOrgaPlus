import { Avatar, Chip, Stack } from "@mui/material";
import { yellow, grey } from "@mui/material/colors";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

import { classIcon, roleIcon } from "../../services/icons";
import { Build } from "models/Build";

interface IChipIconsProps {
	build: Build;
}

const ChipIcons = (props: IChipIconsProps) => {
	const classSrc = classIcon(props.build.class.abbr);
	const roles = props.build.role != null ? props.build.role : [{ id: 0, abbr: "" }];
	const imgProps = {
		sx: { height: 24, width: 24 },
	};

	const prefered = (star: number) => {
		let color = "";

		if (star === 0) {
			color = "#000";
		} else if (star === 1) {
			color = yellow[900];
		} else if (star === 2) {
			color = grey[500];
		} else if (star === 3) {
			color = yellow[700];
		}

		return color;
	};

	return (
		<Stack direction="row" alignItems="center" sx={{ paddingLeft: 1.5, paddingRight: 1.5 }}>
			<Avatar src={classSrc} sx={{ width: 24, marginRight: 0.5 }} imgProps={imgProps} />
			{roles.map((r) => {
				let src = roleIcon(r.abbr);
				return <Avatar src={src} sx={{ width: 24 }} imgProps={imgProps} />;
			})}
			{props.build.prefer > 0 ? (
				<StarIcon sx={{ marginLeft: 1, color: prefered(props.build.prefer) }} />
			) : (
				<StarOutlineIcon sx={{ marginLeft: 1, color: prefered(props.build.prefer) }} />
			)}
		</Stack>
	);
};

interface IProps {
	build: Build;
	ownProfile: boolean;
	star: boolean;
	edit: boolean;
}

const BuildChip = (props: IProps) => {
	const handleDelete = () => {};

	return (
		<span>
			<Chip
				avatar={<ChipIcons build={props.build} />}
				onDelete={handleDelete}
				sx={{ "& .MuiChip-label": { display: "none" } }}
			/>
		</span>
	);
};

export default BuildChip;
