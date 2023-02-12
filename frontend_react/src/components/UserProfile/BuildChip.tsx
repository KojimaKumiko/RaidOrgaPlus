/** @jsxImportSource @emotion/react */
import { Avatar, Chip, css, Stack, styled } from "@mui/material";
import { yellow, grey } from "@mui/material/colors";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

import { classIcon, roleIcon } from "../../services/icons";
import { Build } from "models/Build";
import { Class } from "models/Klasse";

interface IChipIconsProps {
	build: Build;
	showStar?: boolean;
}

const StyledChip = styled(Chip, { shouldForwardProp: (prop) => prop !== "cl" })<{ cl: Class }>(({ cl }) => ({
	"& .MuiChip-label": { display: "none" },
	margin: 4,
	// backgroundColor: cl.color,
}));

const ChipIcons = (props: IChipIconsProps) => {
	const classSrc = classIcon(props.build.class.abbr);
	const roles = props.build.role != null ? props.build.role : [{ id: 0, abbr: "" }];
	const imgProps = {
		sx: { height: 24, width: 24 },
	};

	const prefered = (star: number) => {
		let color = "";

		if (star === 0) {
			color = "#9E9E9E";
		} else if (star === 1) {
			color = yellow[900];
		} else if (star === 2) {
			color = grey[500];
		} else if (star === 3) {
			color = yellow[700];
		}

		return color;
	};

	const showStar = () => {
		let star = null;

		if (props.showStar) {
			star =
				props.build.prefer > 0 ? (
					<StarIcon sx={{ marginLeft: 1, color: prefered(props.build.prefer) }} />
				) : (
					<StarOutlineIcon sx={{ marginLeft: 1, color: prefered(props.build.prefer) }} />
				);
		}

		return star;
	};

	return (
		<Stack direction="row" alignItems="center" sx={{ paddingLeft: 1.5, paddingRight: 1.5 }}>
			<Avatar src={classSrc} sx={{ width: 24, height: 24, marginRight: 0.5 }} imgProps={imgProps} />
			{roles.map((r) => {
				let src = roleIcon(r.abbr);
				return <Avatar src={src} sx={{ width: 24 }} imgProps={imgProps} key={r.id} />;
			})}
			{showStar()}
		</Stack>
	);
};

interface IProps {
	build: Build;
	ownProfile?: boolean;
	star?: boolean;
	edit?: boolean;
	onDelete?: () => void;
}

const BuildChip = (props: IProps) => {
	let chip = null;

	if (props.ownProfile) {
		chip = (
			<StyledChip
				avatar={<ChipIcons build={props.build} showStar={props.star} />}
				onDelete={props.onDelete}
				cl={props.build.class}
			/>
		);
	} else {
		chip = <StyledChip avatar={<ChipIcons build={props.build} showStar={props.star} />} cl={props.build.class} />;
	}

	return chip;
};

export default BuildChip;
