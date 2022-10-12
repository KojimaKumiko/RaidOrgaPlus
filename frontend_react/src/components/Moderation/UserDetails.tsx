/** @jsxImportSource @emotion/react */
import { Fragment } from "react";

import { Chip, Divider, Stack, Typography, css } from "@mui/material";

import { DiscordRole } from "models/Discord";
import { User } from "models/Types";

interface Props {
	user: User;
}

const userDetailsCss = {
	divider: css({
		borderBottomWidth: "medium",
		marginTop: 8,
		marginBottom: 8,
	}),
	header: css({
		marginTop: 0,
		marginBottom: 8,
	}),
	span: css({
		fontWeight: "bold",
		marginLeft: 9
	})
};

const dateOptions: any = { day: "2-digit", month: "2-digit", year: "numeric" };

const ExtraAccounts = (props: Props) => {
	const { user } = props;
	return (
		<Fragment>
			<Divider css={userDetailsCss.divider} />
			<h3 css={userDetailsCss.header}>Extra Accounts</h3>
			{user.extraAccounts.map((e, i) => (
				<Typography key={e.id}>
					<span css={userDetailsCss.span}>Account {i + 1}:</span> {e.accName}
				</Typography>
			))}
		</Fragment>
	);
};

const Discord = (props: Props) => {
	const { discord } = props.user;

	const discordJoinDate = (): string => {
		const date = new Date(discord.joined);
		return date.toLocaleString("de-DE", dateOptions);
	};

	const color = (role: DiscordRole): string => {
		if (role.color === "#000000") {
			return "#ffffff";
		} else {
			return role.color;
		}
	};

	return (
		<Fragment>
			<Divider css={userDetailsCss.divider} />
			<h3 css={userDetailsCss.header}>Discord</h3>
			<Stack direction="row" sx={{ marginBottom: 1 }}>
				{discord.roles.map((role, i) => (
					<Chip key={role.id} label={role.name} sx={{ marginRight: 1, color: color(role), fontSize: 14 }} />
				))}
			</Stack>
			<Typography>
				<span css={userDetailsCss.span}>Accountname:</span> {discord.username}
			</Typography>
			<Typography>
				<span css={userDetailsCss.span}>Nickname:</span> {discord.nickname}
			</Typography>
			<Typography>
				<span css={userDetailsCss.span}>Discord beigetreten:</span> {discordJoinDate()}
			</Typography>
		</Fragment>
	);
};

const Guild = (props: Props) => {
	const { guild } = props.user;

	const guildJoinDate = (): string => {
		const date = new Date(guild.joined);
		return date.toLocaleString("de-DE", dateOptions);
	};

	return (
		<Fragment>
			<Divider css={userDetailsCss.divider} />
			<h3 css={userDetailsCss.header}>Gilde</h3>
			<Typography>
				<span css={userDetailsCss.span}>Gildenrang:</span> {guild.rank}
			</Typography>
			<Typography>
				<span css={userDetailsCss.span}>Gilde beigetreten:</span> {guildJoinDate()}
			</Typography>
		</Fragment>
	);
}

const UserDetails = (props: Props) => {
	const { user } = props;

	const lastActive = (): string => {
		if (!user.lastActive) {
			return "Keine Aufzeichnung";
		}

		const date = Number(new Date(user.lastActive));
		const diff = Number(new Date()) - date;
		const minutes = Math.ceil(diff / (1000 * 60));
		if (minutes === 1) {
			return "gerade eben";
		} else if (minutes < 60) {
			return `vor ${minutes} Minuten`;
		}

		const hours = Math.floor(minutes / 60);
		if (hours === 1) {
			return "vor 1 Stunde";
		} else if (hours < 24) {
			return `vor ${hours} Stunden`;
		}

		const days = Math.floor(hours / 24);
		if (days === 1) {
			return "vor 1 Tag";
		} else {
			return `vor ${days} Tagen`;
		}
	};

	const parseDate = (dateString: any): string => {
		if (dateString) {
			const date = new Date(dateString);
			return date.toLocaleDateString("de-DE", dateOptions);
		} else {
			return "Nie";
		}
	};

	const extraAccounts = user.extraAccounts && user.extraAccounts.length > 0 ? <ExtraAccounts user={user} /> : null;
	const discord = user.discord ? <Discord user={user} /> : null;
	const guild = user.guild ? <Guild user={user} /> : null;

	return (
		<Stack>
			<Typography>
				<span css={userDetailsCss.span}>Account Name:</span> {user.accname}
			</Typography>
			<Typography>
				<span css={userDetailsCss.span}>Anzeige Name:</span> {user.name}
			</Typography>
			<Typography>
				<span css={userDetailsCss.span}>Zuletzt Online:</span> {lastActive()}
			</Typography>
			<Typography>
				<span css={userDetailsCss.span}>Erste Raid-Anmeldung:</span> {parseDate(user.firstTermin)}
			</Typography>
			<Typography>
				<span css={userDetailsCss.span}>Letzte Raid-Anmeldung:</span> {parseDate(user.lastTermin)}
			</Typography>
			{extraAccounts}
			{discord}
			{guild}
		</Stack>
	);
};

export default UserDetails;
