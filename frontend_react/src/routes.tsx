import { LoaderFunctionArgs, Navigate, Outlet, Route, createRoutesFromElements, useLoaderData } from "react-router-dom";

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
import CompositionPage from "./pages/Raids/CompositionPage";
import { getElements, getForTermin } from "./services/endpoints/aufstellungen";
import { getAnmeldungForSpieler, getAnmeldungenForTermin, getTermin } from "./services/endpoints/termine";
import { CompPageLoader } from "./models/types";

const ProtectedRaidRoute = () => {
	const data = useLoaderData() as userRaid;

	if (data.role == null) {
		return <Navigate to="/raids" replace />;
	}

	return <Outlet />;
};

const raidLoader = async ({ params }: LoaderFunctionArgs) => {
	const raid = await getRaidFromId(Number(params.raidId));
	const role = await getRole(Number(params.raidId));
	return { ...raid, role } as userRaid;
};

const compLoader = async ({ params }: LoaderFunctionArgs) => {
	const termin = await getTermin(Number(params.terminId));
	// const composition = await getForTermin(Number(params.terminId));
	// const elements = await getElements(Number(params.terminId));
	// const signUps = await getAnmeldungenForTermin(params.terminId);
	// const signUpPlayer = await getAnmeldungForSpieler(params.terminId);

	// return { termin, composition, elements, signUps, signUpPlayer } as CompPageLoader;
	return { termin } as CompPageLoader;
};

const Routes = () => {
	const routes = (
		<Route path="/" element={<App />}>
			<Route index element={<HomePage />} />
			<Route path="raids" element={<MyRaidPage />} />
			<Route element={<ProtectedRaidRoute />} loader={raidLoader} id="raidPage">
				<Route path="raids/:raidId" element={<RaidPage />}>
					<Route index element={<RaidDashboard />} />
					<Route path="spielerliste" element={<MembersPage />} />
					<Route path="termine" element={<TerminPage />} />
					<Route path="termine/:terminId" element={<CompositionPage />} loader={compLoader} id="compPage" />
					<Route path="archiv" element={<ArchivePage />} />
					<Route path="archiv/:terminId" element={<CompositionPage />} loader={compLoader} id="archivePage"/>
					<Route path="blankos" element={<BlankoPage />} />
					<Route path="settings" element={<RaidSettingsPage />} />
				</Route>
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
