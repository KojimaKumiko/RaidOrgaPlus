import { AuditLogEvent, GuildMember, User } from "discord.js";
import { DiscordEvent } from "models/DiscordEvent";
import { checkRoleHistory, getPlayer, updateRoleHistory } from "../Utils/queries";

export default {
	name: "guildMemberUpdate",
	once: false,
	execute: async (oldMember: GuildMember, newMember: GuildMember): Promise<void> => {
		const oldRoles = oldMember.roles.cache;
		const newRoles = newMember.roles.cache;

		const diff = oldRoles.difference(newRoles);
		if (diff.size <= 0) {
			return;
		}

		console.log("GuildMemberUpdate for User: " + newMember.displayName);

		if (newMember.nickname == null || newMember.nickname.trim() == null) {
			console.log("The user has no nickname");
			return;
		}

		try {
			const player = await getPlayer(newMember.nickname);
			if (player == null) {
				console.log("Could not find an RO+ Account.");
				return;
			}

			const guild = newMember.guild;
			const auditLogs = await guild.fetchAuditLogs({
				type: AuditLogEvent.MemberRoleUpdate,
			});

			const logs = auditLogs.entries.filter((a) => (a.target as User).id === newMember.id);
			if (!logs) return;

			const roleLog = logs.first();
			if (!roleLog) return;

			const executor = await guild.members.fetch(roleLog.executor);

			roleLog.changes.forEach(async (c) => {
				let type: "ADD" | "REMOVE";
				if (c.key === "$remove") {
					type = "REMOVE";
				} else {
					type = "ADD";
				}

				const role = c.new[0].name;
				const check = await checkRoleHistory(player.id, role);
				if (type != check) {
					await updateRoleHistory(player.id, role, type, executor.displayName);
				}
			});
		} catch (e) {
			console.error(e);
		}
	},
} as DiscordEvent;
