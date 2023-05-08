/** @jsxImportSource @emotion/react */
import { Avatar, Box, Stack, css } from "@mui/material";
import { miscIcon } from "../../services/icons";

interface ITrophiesProps {
	insights: any[];
}

const trophiesCss = {
	typeIcon: css({
		marginRight: "5px",
		boxShadow: "1px 1px 2px black",
		borderRadius: 0,
		width: 40,
		height: 40,
	}),
	useIcon: css({
		margin: "0 3px",
		borderRadius: 0,
		width: 30,
		height: 30,
	}),
	useIconFat: css({
		margin: "0 8px",
		borderRadius: 0,
		width: 26,
		height: 26,
	}),
}

const Trophies = (props: ITrophiesProps) => {
	const { insights } = props;
	const { typeIcon, useIcon, useIconFat } = trophiesCss;

	return (
		<Box sx={{ width: "fit-content" }}>
			{insights.map(type => (
				<Stack direction="row" alignItems="center" sx={{ mb: 1 }} key={type.name}>
					<Avatar src={miscIcon(type.name)} css={typeIcon} />
					<Avatar src={miscIcon("inv")} css={useIcon} />
					<span>{type.hand}</span>
					<Avatar src={miscIcon("craft")} css={useIcon} />
					<span>{type.crafted}</span>
					<Avatar src={miscIcon("coffer")} css={useIconFat} />
					<span>{type.coffer}</span>
				</Stack>
			))}
		</Box>
	);
}

export default Trophies;