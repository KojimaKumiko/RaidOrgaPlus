import { Stack, Typography } from "@mui/material";
import { User } from "models/Types";
import ProfileAvatar from "../UserProfile/ProfileAvatar";

interface Props {
	user: User;
}

const UserHeader = (props: Props) => {
	return (
		<Stack direction="row">
			<ProfileAvatar user={props.user} sx={{ marginRight: 2 }} />
			<Stack>
				<Typography>{props.user.accname}</Typography>
				<Typography variant="subtitle2" color="gray">{props.user.name}</Typography>
			</Stack>
		</Stack>
	);
}

export default UserHeader;