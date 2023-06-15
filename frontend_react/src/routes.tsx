import { LoaderFunctionArgs, Route, createRoutesFromElements } from "react-router-dom";

import { getRaidFromId, getRole } from "./services/endpoints/raids";
import { userRaid } from "models/Types";

import App from "./App";
import HomePage from "./pages/HomePage";
import MyRaidPage from "./pages/MyRaidPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import ModerationPage from "./pages/ModerationPage";
import RaidPage from "./pages/Raids/RaidPage";
import MembersPage from "./pages/Raids/MembersPage";
import RaidDashboard from "./pages/Raids/RaidDashboard";
import TerminPage from "./pages/Raids/TerminPage";
import ArchivePage from "./pages/Raids/ArchivePage";
import BlankoPage from "./pages/Raids/BlankoPage";
import RaidSettingsPage from "./pages/Raids/RaidSettingsPage";

const raidLoader = async ({ params }: LoaderFunctionArgs) => {
	const raid = await getRaidFromId(Number(params.raidId));
	const role = await getRole(Number(params.raidId));
	return { ...raid, role } as userRaid;
};

const Routes = () => {
	const routes = (
		<Route path="/" element={<App />}>
			<Route index element={<HomePage />} />
			<Route path="raids" element={<MyRaidPage />} />
			<Route path="raids/:raidId" element={<RaidPage />} loader={raidLoader} id="raidPage">
				<Route index element={<RaidDashboard />} />
				<Route path="spielerliste" element={<MembersPage />} />
				<Route path="termine" element={<TerminPage />} />
				<Route path="archiv" element={<ArchivePage />} />
				<Route path="blankos" element={<BlankoPage />} />
				<Route path="settings" element={<RaidSettingsPage />} />
			</Route>
			<Route path="profile" element={<ProfilePage />} />
			<Route path="profile/:id" element={<ProfilePage />} />
			<Route path="settings" element={<SettingsPage />} />
			<Route path="help" element={<HelpPage />} />
			<Route path="moderation" element={<ModerationPage />} />
		</Route>
	);

	return createRoutesFromElements(routes);
};

export default Routes;
