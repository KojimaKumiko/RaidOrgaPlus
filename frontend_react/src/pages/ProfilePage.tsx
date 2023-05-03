import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";

import { selectWindowWidth } from "../store/slices/baseSlice";
import { selectLoggedInUser } from "../store/slices/userSlice";
import ProfileAvatar from "../components/UserProfile/ProfileAvatar";

import { User } from "../../../models/Types";
import ProfileName from "../components/UserProfile/ProfileName";
import ProfileBuilds from "../components/UserProfile/ProfileBuilds";
import { getWithID, hasProgressShared } from "../services/endpoints/user";
import ProgressOverview from "../components/UserProfile/ProgressOverview";

const ProfilePage = () => {
	const [user, setUser] = useState<User>({} as User);
	const [ownProfile, setOwnProfile] = useState<boolean>(true);
	const [shared, setShared] = useState<boolean>(true);

	const { id } = useParams();

	const loggedInUser = useSelector(selectLoggedInUser) as User;
	const windowWidth = useSelector(selectWindowWidth);

	useEffect(() => {
		const getUser = async (userId: number) => {
			const u = await getWithID(userId);
			const share = await hasProgressShared(userId);

			setUser(u as User);
			setOwnProfile(userId === loggedInUser.id);
			setShared(share);
		};

		if (id != null) {
			getUser(Number(id)).catch(console.error);
		} else {
			setUser(loggedInUser);
			setOwnProfile(true);
			setShared(true);
		}
	}, [id, loggedInUser]);

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
		<Stack>
			<Stack direction="column">
				<ProfileAvatar user={user} size={avatarSize()} />
				<ProfileName user={user} ownProfile={ownProfile} />
			</Stack>
			<Stack direction="column">
				<ProfileBuilds user={user} ownProfile={ownProfile} />
				<ProgressOverview user={user} ownProfile={ownProfile} />
			</Stack>
		</Stack>
	);
};

export default ProfilePage;
