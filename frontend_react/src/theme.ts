import { createTheme, Theme as MaterialUITheme } from "@mui/material";

import "@mui/material/styles";

declare module "@mui/material/styles" {
	interface Palette {
		neutral: Palette["primary"];
	}

	// allow configuration using `createTheme`
	interface PaletteOptions {
		neutral: PaletteOptions["primary"];
	}

	interface TypeBackground {
		main?: string;
	}
}

// Update the Button's color prop options
declare module "@mui/material/Button" {
	interface ButtonPropsColorOverrides {
		neutral: true;
	}
}

declare module "@mui/material/IconButton" {
	interface IconButtonPropsColorOverrides {
		neutral: true;
	}
}

declare module "@mui/material/ToggleButtonGroup" {
	interface ToggleButtonGroupPropsColorOverrides {
		neutral: true;
	}
}

declare module "@mui/material/ToggleButton" {
	interface ToggleButtonPropsColorOverrides {
		neutral: true;
	}
}

declare module "@emotion/react" {
	export interface Theme extends MaterialUITheme {}
}

const theme = createTheme({
	palette: {
		mode: "dark",
		neutral: {
			main: "#272727",
			light: "#363636",
			contrastText: "#fff",
		},
		background: {
			main: "#1e1e1e",
		},
	},
	components: {
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					fontSize: 14,
				},
			},
		},
	},
});

export default theme;