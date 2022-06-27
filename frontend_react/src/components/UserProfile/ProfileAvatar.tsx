import { Avatar, SxProps, Theme } from "@mui/material";

import { miscIcon } from "../../services/icons";

import { User } from "../../../../models/Types";

interface IProps {
	user?: User;
	size?: number;
	sx?: SxProps<Theme>;
}

const ProfileAvatar = (props: IProps) => {
	let src = "";

	if (props.user != null && props.user.discord != null) {
		src = props.user.discord.avatar;
	} else {
		src = miscIcon("raid");
	}

	const { sx, size } = props;
	const style = [
		size != null && {
			width: size, height: size
		},
		...(sx != null ? (Array.isArray(sx) ? sx : [sx]) : [])
	];

	return <Avatar src={src} sx={style} />;
};

export default ProfileAvatar;
