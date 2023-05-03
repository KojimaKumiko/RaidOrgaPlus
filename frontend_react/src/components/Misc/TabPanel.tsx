import { Box } from "@mui/material";

interface TabPanelProps {
	children?: React.ReactNode;
	value: number;
	index: number;
	label: string;
}

const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, label, ...other } = props;

	return (
		<div
			role="tabpanel"
			style={{ visibility: value === index ? "visible" : "hidden" }}
			id={label}
			aria-labelledby={label}
			{...other}>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
};

const a11yProps = (label: string) => {
	return {
		id: label,
		"aria-controls": label,
	};
};

export default TabPanel;
export { TabPanel, a11yProps };
