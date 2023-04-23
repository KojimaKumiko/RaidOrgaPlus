import { Stack, Typography } from "@mui/material";
import { User } from "models/Types";
import ProfileAvatar from "../UserProfile/ProfileAvatar";

interface Props {
	user: User;
}

const UserHeader = (props: Props) => {
	const { user } = props;
	const nameColor = user.discord ? user.discord.color : "#ff3333";

	return (
		<Stack direction="row">
			<ProfileAvatar user={props.user} sx={{ marginRight: 2 }} />
			<Stack>
				<Typography sx={{ color: nameColor }}>{props.user.accname}</Typography>
				<Typography variant="subtitle2" color="gray">{props.user.name}</Typography>
			</Stack>
		</Stack>
	);
}

export default UserHeader;