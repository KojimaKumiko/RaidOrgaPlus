import { ToggleButton, ToggleButtonGroup, css } from "@mui/material";
import { Theme } from "@emotion/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";

const style = {
	toggleButtonBorderRadius: css({
		borderRadius: 24,
	}),
	toggleButton: (theme: Theme) =>
		css({
			borderColor: "hsla(0,0%,100%,.12) !important",
			backgroundColor: theme.palette.neutral.main,
		}),
};

export type SignUpProps = {
	value: number | null;
	onValueChange: (newValue: number | null) => void;
};

export const SignUp = (props: SignUpProps) => {
	const { value, onValueChange } = props;

	return (
		<ToggleButtonGroup value={value} exclusive onChange={(e, v) => onValueChange(v)}>
			<ToggleButton value={0} css={[style.toggleButton, style.toggleButtonBorderRadius]}>
				<CheckCircleIcon color="success" />
			</ToggleButton>
			<ToggleButton value={1} css={style.toggleButton}>
				<CheckCircleOutlineIcon color="warning" />
			</ToggleButton>
			<ToggleButton value={2} css={[style.toggleButton, style.toggleButtonBorderRadius]}>
				<CancelIcon color="error" />
			</ToggleButton>
		</ToggleButtonGroup>
	);
};
