import { AuditLogEvent } from "discord-api-types";
import { GuildMember, User } from "discord.js";
import { DiscordEvent } from "models/DiscordEvent";
import { checkRoleHistory, getPlayer, updateRoleHistory } from "../Utils/queries";

export default {
	name: "guildMemberUpdate",
	once: false,
	execute: async (oldMember: GuildMember, newMember: GuildMember): Promise<void> => {
		try {
			const player = await getPlayer(newMember.displayName);

			const guild = newMember.guild;
			const auditLogs = await guild.fetchAuditLogs({
				type: AuditLogEvent.MemberRoleUpdate,
			});

			const logs = auditLogs.entries.filter(a => (a.target as User).id === newMember.id);
			if (!logs) return

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
		}
		catch (e) {
			console.error(e);
		}
	},
} as DiscordEvent;
