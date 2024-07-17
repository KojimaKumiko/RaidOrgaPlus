import React from "react";

import { Divider, Stack } from "@mui/material";

import ApiKeySettings from "../components/Settings/ApiKeySettings";
import EmailSettings from "../components/Settings/EmailSettings";
import PasswordSettings from "../components/Settings/PasswordSettings";
import ThemeSettings from "../components/Settings/ThemeSettings";

const SettingsPage = () => {
	return (
		<React.Fragment>
			<h2>Einstellungen</h2>
			<Stack divider={<Divider sx={{ marginTop: 2 }} />}>
				<ApiKeySettings />
				<EmailSettings />
				<PasswordSettings />
				<ThemeSettings />
			</Stack>
		</React.Fragment>
	);
};

export default SettingsPage;
