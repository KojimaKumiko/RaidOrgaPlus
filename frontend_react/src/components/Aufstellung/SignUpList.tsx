/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import axios from "axios";

import { ExpandLess } from "@mui/icons-material";
import { Button, Icon, Popper, Fade, Card, List, ListItem, ListItemText, css, Theme } from "@mui/material";

import { Spieler, SpielerTermin } from "models/Spieler";
import { getAnmeldungenForTermin } from "../../services/endpoints/termine";

const style = {
	spanContainer: css({
		display: "flex",
		marginRight: "8px",
		marginLeft: "4px",
	}),
	signUpCount: css({
		marginRight: "2px",
	}),
	signUpList: css({
		borderRadius: 0,
		marginRight: "8px"
	}),
	signUpListCard: css({
		borderRadius: 0,
	})
};

interface SignUpListProps {
	signInList: (Spieler & SpielerTermin)[];
}

const SignUpList = (props: SignUpListProps) => {
	const { signInList } = props;

	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [popperWidth, setPopperWidth] = useState(0);

	const open = Boolean(anchorEl);

	// useEffect(() => {
	// 	const abortController = new AbortController();

	// 	const getData = async () => {
	// 		try {
	// 			const data = await getAnmeldungenForTermin(terminId);
	// 			setSignUps(data);
	// 		} catch (error) {
	// 			if (axios.isCancel(error)) {
	// 				console.log(error);
	// 			} else {
	// 				throw error;
	// 			}
	// 		}
	// 	};

	// 	getData().catch(console.error);

	// 	return () => {
	// 		abortController.abort();
	// 	};
	// }, []);

	const signUpIcon = (type: number) => {
		const icons = ["check_circle", "check_circle_outline", "cancel", "help"];
		return icons[type];
	};

	const signUpColor = (type: number) => {
		const colors = ["success", "warning", "error", "neutral"];
		return colors[type];
	};

	const signUpCount = () => {
		const yes = signInList.filter((s) => s.type === 0);
		const maybe = signInList.filter((s) => s.type === 1);
		const no = signInList.filter((s) => s.type === 2);
		return [yes, maybe, no];
	};

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (open) {
			setAnchorEl(null);
		} else {
			setAnchorEl(event.currentTarget);
		}
	};

	useEffect(() => {
		if (anchorEl) {
			setPopperWidth(anchorEl.clientWidth);
		}
	}, [anchorEl]);

	return (
		<>
			<Button color="neutral" variant="contained" onClick={handleClick} disableRipple css={style.signUpList}>
				{signUpCount().map((s, i) => (
					<span key={i} css={style.spanContainer}>
						<span css={style.signUpCount}>{s.length}</span>
						<Icon color={signUpColor(i) as any}>{signUpIcon(i)}</Icon>
					</span>
				))}
				<ExpandLess sx={{ transition: "all 0.5s ease", transform: `rotate(${open ? 0 : "0.5turn"})` }} />
			</Button>
			<Popper open={open} anchorEl={anchorEl} placement="bottom-start" transition sx={{ width: popperWidth }}>
				{({ TransitionProps }) => (
					<Fade {...TransitionProps}>
						<Card css={style.signUpListCard}>
							<List>
								{signInList.map((s) => (
									<ListItem
										key={s.id}
										secondaryAction={
											<Icon color={signUpColor(s.type) as any}>{signUpIcon(s.type)}</Icon>
										}>
										<ListItemText primary={s.name} />
									</ListItem>
								))}
							</List>
						</Card>
					</Fade>
				)}
			</Popper>
		</>
	);
};

export default SignUpList;
