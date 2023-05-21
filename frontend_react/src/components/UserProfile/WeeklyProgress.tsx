import { Avatar, Box, Stack, Tooltip } from "@mui/material";
import { Encounter } from "models/Encounter";
import { encIcon, miscIcon } from "../../services/icons";
import { useEffect } from "react";

interface IWeeklyProgressProps {
	encounters: Encounter[][];
	progress: any[];
}
const WeeklyProgress = (props: IWeeklyProgressProps) => {
	const { encounters, progress } = props;

	const emboldenedTimeRef = Number(new Date("2022-10-03T00:00:10"));
	const buffTimeRef = Number(new Date("2022-09-26T00:00:10"));

	const progressColor = (boss: Encounter): string => {
		const color: string = progress != null && progress.indexOf(boss.apiname) !== -1 ? "success.main" : "error.main";
		return color;
	};

	const getBuffAvatar = (wing: number) => {
		let avatar = null;

		if (isBuffWing(emboldenedTimeRef, wing)) {
			avatar = (
				<Tooltip title="Emboldened" disableInteractive>
					<Avatar src={miscIcon("embold")} sx={{ height: "56px", width: "56px" }} />
				</Tooltip>
			);
		} else if (isBuffWing(buffTimeRef, wing)) {
			avatar = (
				<Tooltip title="Call of the Mists" disableInteractive>
					<Avatar src={miscIcon("cotm")} sx={{ height: "56px", width: "56px" }} />
				</Tooltip>
			);
		}

		return avatar;
	};

	const isBuffWing = (timeReference: number, wing: number): boolean => {
		const difference = Number(new Date()) - timeReference;
		const rotations = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
		const rotationWing = (rotations % encounters.length) + 1;
		return wing === rotationWing;
	};

	const getBuffWing = (wing: number) => isBuffWing(buffTimeRef, wing);
	const getEmboldenedWing = (wing: number) => isBuffWing(emboldenedTimeRef, wing);

	return (
		<Box sx={{ width: "fit-content" }}>
			{encounters.map((encounter) => (
				<Stack
					direction="row"
					sx={[
						{ mt: 0.5, mb: 0.5, pr: 1 },
						(getBuffWing(encounter[0].wing) || getEmboldenedWing(encounter[0].wing)) && {
							bgcolor: "#445570",
							boxShadow: "1px 1px 6px black",
							borderRadius: "30px",
						},
					]}
					key={encounter[0].wing}>
					<Box sx={{ float: "left", ml: 1, mr: 1, height: "56px", width: "56px" }}>
						{getBuffAvatar(encounter[0].wing)}
					</Box>
					{encounter.map((boss) => (
						<Tooltip title={boss.name} key={boss.name} disableInteractive>
							<Avatar
								src={encIcon(boss.abbr)}
								sx={{
									borderStyle: "solid",
									borderColor: progressColor(boss),
									borderWidth: "4px",
									height: "56px",
									width: "56px",
								}}
								imgProps={{
									height: "48px",
									width: "48px",
								}}
							/>
						</Tooltip>
					))}
				</Stack>
			))}
		</Box>
	);
};

export default WeeklyProgress;