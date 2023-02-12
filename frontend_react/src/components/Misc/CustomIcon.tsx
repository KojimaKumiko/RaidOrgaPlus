import { Avatar, SxProps, Theme, AvatarProps } from "@mui/material";

interface IconProps extends AvatarProps {
	src: string;
	imgProps?: { width: number; height: number };
	sx?: SxProps<Theme> | undefined;
}

const CustomIcon = (props: IconProps) => {
	const { src, imgProps, sx, ...rest } = props;

	let imgAttr: any;
	if (!imgProps) {
		imgAttr = { sx: { height: 28, width: 28 } };
	}
	else {
		imgAttr = { sx: imgProps };
	}

	return <Avatar src={src} imgProps={imgAttr} sx={[...(Array.isArray(sx) ? sx : [sx])]} {...rest} />;
};

export default CustomIcon;
