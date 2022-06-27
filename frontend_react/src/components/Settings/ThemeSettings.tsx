import { FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

const ThemeSettings = () => {
	return (
		<Stack spacing={1}>
			<h3>Theme auswahl</h3>
			<FormControl>
				<InputLabel id="theme-select-label">Theme</InputLabel>
				<Select labelId="theme-select-label" label="Theme">
					<MenuItem value={"light"}>Light</MenuItem>
					<MenuItem value={"dark"}>Dark</MenuItem>
				</Select>
			</FormControl>
		</Stack>
	);
}

export default ThemeSettings;