import { Box, CircularProgress } from "@mui/material";

interface IProps {
	loading: boolean;
}

const spinner = (props: IProps) => {
	return (
		<Box sx={[ props.loading && { display: "flex" }, !props.loading && { display: "none" } ]}>
			<CircularProgress />
		</Box>
	);
};

export default spinner;
