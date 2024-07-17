import { Stack } from "@mui/material";

import { useAppSelector } from "../store/hooks";
import { selectLoggedInUser } from "../store/slices/userSlice";
import HomePageTermine from "../components/Homepage/HomePageTermine";
import ProgressOverview from "../components/UserProfile/ProgressOverview";

const HomePage = () => {
	const user = useAppSelector(selectLoggedInUser);

	return (
		<Stack direction="row">
			<HomePageTermine />
			<ProgressOverview maxWidth="md" user={user!} ownProfile />
		</Stack>
	);
};

export default HomePage;
