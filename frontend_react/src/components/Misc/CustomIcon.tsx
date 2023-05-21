import { Avatar, SxProps, Theme, AvatarProps, Tooltip } from "@mui/material";

interface IconProps extends AvatarProps {
	src: string;
	imgProps?: { width: number; height: number };
	sx?: SxProps<Theme> | undefined;
	tooltip?: string;
	disableInteractive?: boolean;
}

const CustomIcon = (props: IconProps) => {
	const { src, imgProps, sx, tooltip, disableInteractive, ...rest } = props;

	let imgAttr: any;
	if (!imgProps) {
		imgAttr = { sx: { height: 28, width: 28 } };
	}
	else {
		imgAttr = { sx: imgProps };
	}

	const avatar = <Avatar src={src} imgProps={imgAttr} sx={[...(Array.isArray(sx) ? sx : [sx])]} {...rest} />;

	if (tooltip) {
		return (
			<Tooltip title={tooltip} arrow disableInteractive={disableInteractive}>
				{avatar}
			</Tooltip>
		);
	}
	else {
		return avatar;
	}
};

export default CustomIcon;
