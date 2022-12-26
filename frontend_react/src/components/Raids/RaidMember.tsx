/** @jsxImportSource @emotion/react */
import { Avatar, Card, CardContent, CardHeader, css, Icon, Typography, useTheme } from "@mui/material";
import { grey, yellow } from "@mui/material/colors";
import { Build } from "models/Build";
import { Spieler } from "models/Spieler";
import { useEffect, useState } from "react";
import { getBuilds } from "../../services/endpoints/user";
import BuildChip from "../UserProfile/BuildChip";

interface IProps {
	member: Spieler;
}

const RaidMember = (props: IProps) => {
	const { member } = props;
	const stars = [3, 2, 1, 0];

	const [builds, setBuilds] = useState<Build[]>([]);
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

	return (
		<Card>
			<CardHeader title={member.name} />
			<CardContent>
				{builds && builds.length > 0 ? (
					stars.map((star) => (
						<span style={{ display: "flex" }} key={star}>
							{getStar(star)}
							<div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
								{builds
									.filter((b) => b.prefer === star)
									.map((b) => (
										<BuildChip build={b} key={`${b.class.id}  ${b.prefer}  ${b.role.length}`} />
									))}
							</div>
						</span>
					))
				) : (
					<Typography>Keine Builds vorhanden</Typography>
				)}
			</CardContent>
		</Card>
	);
};

export default RaidMember;
