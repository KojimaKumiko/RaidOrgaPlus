import { AppBar, Breadcrumbs, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Raid } from "models/Raid";
import { Link, useLoaderData, useLocation, useMatches } from "react-router-dom";

const RaidPage = () =>  {
	const raid = useLoaderData() as Raid;
	const matches = useMatches();

	console.log(matches);

	return (
		<Box>
			<AppBar position="sticky">
				<Toolbar>
					<Breadcrumbs aria-label="breadcrumb">
						<Link to=".." relative="path">Meine Raids</Link>
						<Link to=".">{raid.name}</Link>
					</Breadcrumbs>
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export default RaidPage;