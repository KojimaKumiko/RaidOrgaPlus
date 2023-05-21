import { Box, FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { hasProgressShared, setProgressShared } from "../../services/endpoints/user";

const ProgressShare = () => {
	const [share, setShare] = useState(false);

	useEffect(() => {
		const getProgressShare = async () => {
			const shared = await hasProgressShared(null);
			setShare(shared);
		};

		getProgressShare().catch(console.error);
	}, []);

	const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target;

		setShare(checked);
		await setProgressShared(checked);
	};

	return (
		<Box>
			<FormControlLabel
				control={<Switch checked={share} onChange={handleChange} />}
				label="Für Profilbesucher anzeigen"
			/>
		</Box>
	);
};

export default ProgressShare;
