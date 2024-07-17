import { Outlet, useRouteLoaderData } from "react-router-dom";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { userRaid } from "models/Types";

const RaidPage = () => {
	const raid = useRouteLoaderData("raidPage") as userRaid;
	// const matches = useMatches();

	// console.log(matches);

	const handleBack = () => {
		window.history.back();
	};

	return (
		<Box>
			<AppBar position="sticky">
				<Toolbar>
					{/* <Breadcrumbs aria-label="breadcrumb">
						<Link to=".." relative="path">Meine Raids</Link>
						<Link to=".">{raid.name}</Link>
					</Breadcrumbs> */}
					<IconButton onClick={handleBack}>
						<ArrowBackIcon />
					</IconButton>
					{raid.name}
				</Toolbar>
			</AppBar>
			<Outlet />
		</Box>
	);
};

export default RaidPage;
