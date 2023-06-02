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
import ExtraAccounts from "../components/UserProfile/ExtraAccounts";
import ProgressShare from "../components/UserProfile/ProgressShare";
import axios from "axios";

const ProfilePage = () => {
	const [user, setUser] = useState<User>({} as User);
	const [ownProfile, setOwnProfile] = useState(false);
	const [sharedProgress, setSharedProgress] = useState(false);

	const { id } = useParams();

	const loggedInUser = useSelector(selectLoggedInUser) as User;
	const windowWidth = useSelector(selectWindowWidth);

	useEffect(() => {
		const abortController = new AbortController();

		const getUser = async (userId: number) => {
			try {
				const user = await getWithID(userId, abortController.signal);
				const shared = await hasProgressShared(userId, abortController.signal);

				setUser(user as User);
				setOwnProfile(userId === loggedInUser.id);
				setSharedProgress(shared);
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log(error);
				} else {
					throw error;
				}
			}
		};

		if (id != null) {
			getUser(Number(id)).catch(console.error);
		} else {
			setUser(loggedInUser);
			setOwnProfile(true);
			setSharedProgress(true);
		}

		return () => {
			abortController.abort();
		};
	}, [id, loggedInUser]);

	console.log([id, loggedInUser]);

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
				{ownProfile ? (
					<>
						<ExtraAccounts />
						<ProgressShare />
					</>
				) : null}
				{sharedProgress ? <ProgressOverview user={user} ownProfile={ownProfile} /> : null}
			</Stack>
		</Stack>
	);
};

export default ProfilePage;
