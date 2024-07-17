import { Box, CircularProgress } from "@mui/material";

interface IProps {
	loading: boolean;
	style?: any;
}

const spinner = (props: IProps) => {
	return (
		<Box sx={[props.loading && { display: "flex" }, !props.loading && { display: "none" }, props.style]}>
			<CircularProgress />
		</Box>
	);
};

export default spinner;
