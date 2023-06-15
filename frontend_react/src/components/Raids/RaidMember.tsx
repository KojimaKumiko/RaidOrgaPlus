/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { Avatar, Button, Card, CardContent, CardHeader, css, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, useTheme } from "@mui/material";
import { grey, yellow } from "@mui/material/colors";
import ClearIcon from "@mui/icons-material/Clear";

import { Build } from "models/Build";
import { Spieler } from "models/Spieler";
import { getBuilds } from "../../services/endpoints/user";
import BuildChip from "../UserProfile/BuildChip";
import { miscIcon } from "../../services/icons";

import { userRaid } from "models/Types";

interface IProps {
	member: Spieler;
	onKickPlayer: (member: Spieler) => void;
}

const RaidMember = (props: IProps) => {
	const { member, onKickPlayer } = props;
	const stars = [3, 2, 1, 0];

	const raid = useRouteLoaderData("raidPage") as userRaid;

	const [builds, setBuilds] = useState<Build[]>([]);
	const [open, setOpen] = useState(false);
	const theme = useTheme();

	const style = {
		avatar: css({
			backgroundColor: "unset",
		}),
	};

	useEffect(() => {
		const getMemberBuilds = async () => {
			setBuilds(await getBuilds(member.id));
		};

		getMemberBuilds().catch(console.error);
	}, [member]);

	const starColor = (starNr: number): string => {
		let starColor = "";

		if (starNr === 1) {
			starColor = yellow[900];
		} else if (starNr === 2) {
			starColor = grey[500];
		} else {
			starColor = yellow[700];
		}

		return starColor;
	};

	const getStar = (star: number) => {
		if (builds.filter((b) => b.prefer === star).length > 0) {
			if (star > 0) {
				return (
					<Avatar css={style.avatar}>
						<Icon sx={{ color: starColor(star) }}>star</Icon>
					</Avatar>
				);
			} else {
				return (
					<Avatar css={style.avatar}>
						<Icon sx={{ color: "#9E9E9E" }}>star_outline</Icon>
					</Avatar>
				);
			}
		}

		return null;
	};

	const getAvatar = (member: Spieler) => {
		let avatar = null;

		if (member.role === 2) {
			avatar = miscIcon("comm");
		} else if (member.role === 1) {
			avatar = miscIcon("lieutenant");
		} else {
			return null;
		}

		return <Avatar src={avatar} sx={{ width: 24, height: 24 }} />;
	};

	const getAction = (member: Spieler) => {
		if (raid == null) {
			return;
		}
		
		if (raid.role <= member.role) {
			return null;
		}

		return (
			<IconButton color="error" onClick={() => setOpen(true)}>
				<ClearIcon />
			</IconButton>
		);
	}

	const handleClose = () => {
		setOpen(false);
	}

	const generateKey = (build: Build) => {
		let key = `${build.class.id}_${build.prefer}`;
		build.role.forEach(r => key += `_${r.id}`);
		return key;
	}

	return (
		<span>
			<Card sx={{ height: "100%" }}>
				<CardHeader
					title={member.name}
					titleTypographyProps={{ fontSize: "1.2rem", fontWeight: "bold" }}
					avatar={getAvatar(member)}
					action={getAction(member)}
				/>
				<CardContent>
					{builds && builds.length > 0 ? (
						stars.map((star) => (
							<span style={{ display: "flex" }} key={star}>
								{getStar(star)}
								<div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
									{builds
										.filter((b) => b.prefer === star)
										.map((b) => (
											<BuildChip build={b} key={generateKey(b)} />
										))}
								</div>
							</span>
						))
					) : (
						<Typography>Keine Builds vorhanden</Typography>
					)}
				</CardContent>
			</Card>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<Typography>Dies entfernt {member.name} aus dem Raid. Bist du dir sicher?</Typography>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" color="error" onClick={() => onKickPlayer(member)}>{member.name} entfernen</Button>
					<Button variant="contained" color="neutral" onClick={handleClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</span>
	);
};

export default RaidMember;
