import { useSelector } from "react-redux";

import Stack from "@mui/material/Stack";

import { selectWindowWidth } from "../store/slices/baseSlice";
import { selectLoggedInUser } from "../store/slices/userSlice";
import ProfileAvatar from "../components/UserProfile/ProfileAvatar";

import { User } from "../../../models/Types";
import ProfileName from "../components/UserProfile/ProfileName";

const ProfilePage = () => {
	const loggedInUser = useSelector(selectLoggedInUser) as User;
	const windowWidth = useSelector(selectWindowWidth);

	const avatarSize = () => {
		if (windowWidth > 1510) {
			return 128;
		} else if (windowWidth > 1263) {
			return 112;
		} else {
			return 96;
		}
	};

	return (
		<span>
			<h2>Profile</h2>
			<Stack>
				<Stack direction="row">
					<ProfileAvatar user={loggedInUser} size={avatarSize()} />
					<ProfileName user={loggedInUser} ownProfile={true} />
				</Stack>
			</Stack>
		</span>
	);
};

export default ProfilePage;
