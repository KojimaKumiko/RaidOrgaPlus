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