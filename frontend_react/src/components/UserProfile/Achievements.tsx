/** @jsxImportSource @emotion/react */
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Box,
	Stack,
	Tooltip,
	Typography,
	css,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Unstable_Grid2";

import { encIcon, miscIcon, wingIcon } from "../../services/icons";

interface IAchievementsProps {
	achievementList: any[];
	achievementsDone: any[];
}

const achievementsCss = {
	achievementCss: css({
		backgroundColor: "#445570",
		height: "100%",
		borderRadius: 5,
		padding: 5,
	}),
	doneCss: css({
		backgroundColor: "#148540",
	}),
	iconCss: css({
		height: 24,
		width: 24,
	}),
	raidIconCss: css({
		height: 48,
		width: 48,
		marginRight: 12,
	}),
	containerCss: css({
		padding: 4,
	}),
};

const Achievements = (props: IAchievementsProps) => {
	const { achievementList, achievementsDone } = props;
	const { achievementCss, doneCss, iconCss, raidIconCss, containerCss } = achievementsCss;

	const doneCount = (achievements: any) => {
		return achievements.filter((a: any) => achievementsDone.indexOf(a.id) !== -1).length;
	};

	const isDone = (achievement: any) => {
		return achievementsDone.indexOf(achievement.id) !== -1;
	};

	const encounterIcon = (achievement: any) => {
		return achievement.boss ? <Avatar src={encIcon(achievement.boss)} css={iconCss} /> : null;
	};

	const complete = (achievements: any) => {
		return achievements.length === doneCount(achievements);
	};

	const conditionIcon = (achievement: any) => {
		let icon: string | null = null;
		let reqText: string | null = null;

		switch (achievement.condition) {
			case "group":
				icon = miscIcon("contacts");
				reqText = "Erfolg muss als Gruppe erledigt werden";
				break;
			case "cm":
				icon = miscIcon("cm");
				reqText = "Challenge Mote";
				break;
			case "meta":
				icon = miscIcon("meta");
				reqText = "Meta-Erfolg";
				break;
			case "self":
				icon = miscIcon("achievement");
				reqText = "Bonus-Erfolg";
				break;
			default:
				break;
		}

		return icon ? (
			<Tooltip title={reqText} disableInteractive>
				<Avatar src={icon} css={iconCss} sx={{ mr: "4px" }} />
			</Tooltip>
		) : null;
	};

	return (
		<Box>
			{achievementList.map((raidAchievements) => (
				<Accordion key={raidAchievements.name} sx={{ bgcolor: "background.main" }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Stack direction="row" alignItems="center">
							<Avatar src={wingIcon(raidAchievements.wing)} css={raidIconCss} />
							<Typography sx={[complete(raidAchievements.achievements) && { color: "success.main" }]}>
								{raidAchievements.name} - {doneCount(raidAchievements.achievements)} /{" "}
								{raidAchievements.achievements.length}
							</Typography>
						</Stack>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container>
							{raidAchievements.achievements.map((achievement: any) => (
								<Grid xs={6} sm={6} md={3} key={achievement.id} css={containerCss}>
									<Box css={[achievementCss, isDone(achievement) && doneCss]}>
										<Stack direction="row">
											<Typography sx={{ m: "auto" }}>{achievement.name}</Typography>
											{conditionIcon(achievement)}
											{encounterIcon(achievement)}
										</Stack>
										<Typography>{achievement.req}</Typography>
									</Box>
								</Grid>
							))}
						</Grid>
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
};

export default Achievements;
