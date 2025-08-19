import {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	MessageContextMenuCommandInteraction,
	CacheType,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	PermissionsBitField,
	GuildMember,
	Message,
	userMention,
	channelMention,
} from "discord.js";
import { defaultEmbed } from "../Utils/embedProvider";
import { checkAccountName } from "../Utils/misc";
import { getPlayer, upgradePlayer } from "../Utils/queries";

type orgaAccount = { id: number; accname: string };

const command = new ContextMenuCommandBuilder()
	.setName("Bewerbung prüfen")
	.setType(ApplicationCommandType.Message)
	.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
	.setDMPermission(false);

const executeCommand = async (interaction: MessageContextMenuCommandInteraction<CacheType>): Promise<void> => {
	const message = interaction.targetMessage;

	if (!message.embeds || message.embeds.length <= 0) {
		await interaction.reply({ content: "Bei der Message konnte kein Embed gefunden werden.", ephemeral: true });
		return;
	}

	const embed = message.embeds[0];
	const field = embed.fields.find((f) => f.name === "Account Name");
	if (!field) {
		await interaction.reply({
			content: "Es wurde kein Feld mit dem Namen 'Account Name' gefunden.",
			ephemeral: true,
		});
		return;
	}

	const accountName = field.value;
	const isNameCorrect = checkAccountName(accountName);

	const userString = embed.description;
	const userId = /\d+/.exec(userString)[0];

	const guildMember = await interaction.guild.members.fetch(userId);
	const nickname = guildMember.nickname ?? "-";
	const isNicknameCorrect =
		guildMember.nickname != null && guildMember.nickname.trim() != null
			? guildMember.nickname.includes(accountName)
			: false;

	let hasOrgaAccount = false;
	let orgaAccount: orgaAccount;
	try {
		orgaAccount = await getPlayer(accountName);
		hasOrgaAccount = !!orgaAccount;
	} catch (e) {
		console.error(e);
	}

	const emojiYes = interaction.client.emojis.cache.find((emoji) => emoji.name === "yes");
	const emojiNo = interaction.client.emojis.cache.find((emoji) => emoji.name === "no");

	const accountNameValue = accountName + " " + (isNameCorrect ? emojiYes.toString() : emojiNo.toString());
	const nicknameValue = nickname + " " + (isNicknameCorrect ? emojiYes.toString() : emojiNo.toString());
	const orgaAccountValue = hasOrgaAccount ? emojiYes.toString() : emojiNo.toString();
	
	const hasRole = guildMember.roles.cache.has(process.env.OPEN_ROLE);
	const hasRoleValue = hasRole ? emojiYes.toString() : emojiNo.toString();

	const resultEmbed = defaultEmbed()
		.setDescription(userString)
		.setTitle("Ergebnis der Überprüfung")
		.addFields([
			{ name: "Account Name korrekt?", value: accountNameValue },
			{ name: "Nickname korrekt?", value: nicknameValue },
			{ name: "RO+ Account vorhanden?", value: orgaAccountValue },
			{ name: "Bewerbungs Rolle vorhanden?", value: hasRoleValue },
		]);

	const finishButton = new ButtonBuilder()
		.setCustomId("finishBewerbung")
		.setLabel("Bewerbung abschließen")
		.setStyle(ButtonStyle.Success)
		.setDisabled(!(isNameCorrect && isNicknameCorrect && hasOrgaAccount));

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(finishButton);
	const components = hasRole ? [row] : [];

	const reply = await interaction.reply({ embeds: [resultEmbed], components: components, ephemeral: true });

	try {
		const response = await reply.awaitMessageComponent({ time: 60_000 });

		if (response.customId === "finishBewerbung") {
			await finishBewerbung(guildMember, message, orgaAccount);

			await response.update({ content: "Die Bewerbung wurde erfolgreich abgeschlossen!", components: [] });

			const welcomeChannel = await interaction.guild.channels.fetch(process.env.WELCOME_CHANNEL);
			if (welcomeChannel && welcomeChannel.isTextBased()) {
				const msg = `Hey ${userMention(guildMember.user.id)}, schön, dass du deinen Weg zu uns gefunden hast. <:aurene2:546815178440704001>
Alle wichtigen Infos zur Community findest du in ${channelMention("504274282550132768")}. Falls du eine Raid-Gruppe suchst, schau doch mal in unsere ${channelMention("1047119423145791488")}, gib ein Gesuch unter ${channelMention("807294070173990952")} auf oder melde dich spontan auf ein Gesuch im ${channelMention("380353536745275393")}.
Du bist die ersten 60 Tage als Newbie gekennzeichnet, dies hat aber keinen Einfluss auf deine Rechte in der Community.`;
				await welcomeChannel.send(msg);
			}
		}
	} catch (e) {
		await interaction.editReply({ components: [] });
	}
};

const finishBewerbung = async (guildMember: GuildMember, message: Message, account: orgaAccount) => {
	try {
		await guildMember.roles.remove(process.env.OPEN_ROLE, "Bewerbung abgeschlossen");
		await guildMember.roles.add(process.env.TRIAL_ROLE, "Bewerbung abgeschlossen");
		await guildMember.roles.add(process.env.RAIDER_ROLE, "Bewerbung abgeschlossen");
		await upgradePlayer(account.id);
		await message.react("👍");
	} catch (e) {
		console.error(e);
	}
}

export default {
	data: command,
	execute: executeCommand,
	production: true,
	global: false,
};