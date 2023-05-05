import { Avatar, Box, Stack } from "@mui/material";
import { miscIcon } from "../../services/icons";

interface ITrophiesProps {
	insights: any[];
}

const Trophies = (props: ITrophiesProps) => {
	const { insights } = props;

	return (
		<Box sx={{ width: "fit-content" }}>
			{insights.map(type => (
				<Stack direction="row">
					<Avatar src={miscIcon(type.name)} />
					<Avatar src={miscIcon("inv")} />
					<span>{type.hand}</span>
					<Avatar src={miscIcon("craft")} />
					<span>{type.crafted}</span>
					<Avatar src={miscIcon("coffer")} />
					<span>{type.coffer}</span>
				</Stack>
			))}
		</Box>
	);
}

export default Trophies;