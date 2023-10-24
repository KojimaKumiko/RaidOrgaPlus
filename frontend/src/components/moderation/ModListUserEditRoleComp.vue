<template>
    <div>
		<div class="headline heading">
			Spieler Rang
		</div>
		<v-btn-toggle
			mandatory rounded v-model="role" class="btnGroup" @change="change">
			<v-tooltip bottom>
				<template v-slot:activator="{ on}">
					<v-btn v-on="on">
						Normal
					</v-btn>
				</template>
				<span>Spieler*in, welche*r nicht zur Community gehört. <br />Hat keine Rechte.</span>
			</v-tooltip>
			<v-tooltip bottom>
				<template v-slot:activator="{on}">
					<v-btn v-on="on">
						Raider
					</v-btn>
				</template>
				<span>Spieler*in, wo die Bewerbung akzeptiert wurde und zur Community gehört.<br />Hat standard rechte.</span>
			</v-tooltip>
			<v-tooltip bottom>
				<template v-slot:activator="{on}">
					<v-btn :disabled="disabled" v-on="on">
						MAZ
					</v-btn>
				</template>
				<span>Moderator*in auf Zeit.<br />Hat lese rechte für die Moderations-Ansicht.</span>
			</v-tooltip>
			<v-tooltip bottom>
				<template v-slot:activator="{on}">
					<v-btn :disabled="disabled" v-on="on">
						Moderator
					</v-btn>
				</template>
				<span>Moderator*in.<br />Hat lese und schreibrechte für die Moderations-Ansicht.</span>
			</v-tooltip>
		</v-btn-toggle>
    </div>
</template>

<script lang="ts">
	import Vue, { PropType } from 'vue';
    import _moderation from '../../services/endpoints/moderation';
	import { UserRole } from '../../../../models/Enums'
	import { Spieler } from 'models/Spieler';

    export default Vue.extend({
        name: "ModListUserEditRoleComp",
		props: {
			user: Object as PropType<Spieler>,
		},
        data: () => ({
			role: UserRole.Normal
        }),
		computed: {
			disabled: function(): boolean {
				return this.$vStore.getters.loggedInUser.role <= UserRole.Maz;
			}
		},
        methods: {
			change: async function(): Promise<void> {
				await _moderation.updateSpielerRole(this.user.id, this.role);
			}
        },
        created: async function (): Promise<void> {
			this.role = this.user.role;
        }
    })
</script>

<style scoped>
	.btnGroup {
		margin-top: 15px;
	}

	.heading {
        margin: 10px 0;
    }
</style>
