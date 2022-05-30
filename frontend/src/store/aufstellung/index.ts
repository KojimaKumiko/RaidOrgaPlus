import _termine from "../../services/endpoints/termine";
import _aufstellungen from "../../services/endpoints/aufstellungen";
import WSClient from "../../services/websocket";
import _raids from "../../services/endpoints/raids";
import _preview from "../../services/endpoints/preview";
import { ActionContext, Module } from "vuex";
import {
	AufstellungActions,
	AufstellungActionsDefinition,
	AufstellungGettersDefinition,
	AufstellungMutations,
	AufstellungMutationsDefinition,
	AufstellungState,
} from "@/models/Store/AufstellungState";
import { RootState } from "@/models/Store/RootState";
import { Aufstellung } from "../../../../models/Aufstellung";
import { Encounter } from "../../../../models/Encounter";
import { element, terminDate } from "../../../../models/Types";
import { Termin } from "../../../../models/Termin";
import { aufstellungPick } from "@/models/Types";
import { Role } from "../../../../models/Rolle";

const mutations: AufstellungMutationsDefinition = {
	[AufstellungMutations.SetActive]: (state: AufstellungState, isActive: any) => {
		state.isActive = isActive;
	},
	[AufstellungMutations.SetAufstellungen]: (state: AufstellungState, aufstellungen: (Aufstellung & Encounter)[]) => {
		state.aufstellungen = aufstellungen;
	},
	[AufstellungMutations.SetElements]: (state: AufstellungState, elements: element[]) => {
		state.elements = elements;
	},
	[AufstellungMutations.SetLocked]: (state: AufstellungState, locked: any) => {
		state.locked = locked;
	},
	[AufstellungMutations.SetAnmeldungen]: (state: AufstellungState, anmeldungen: any) => {
		state.anmeldungen = anmeldungen;
	},
	[AufstellungMutations.SetAnmeldung]: (state: AufstellungState, anmeldung: any) => {
		state.anmeldung = anmeldung;
	},
	[AufstellungMutations.StartWSClient]: (state: AufstellungState, termin: any) => {
		state.wsClient = new WSClient(termin.id);
	},
	[AufstellungMutations.SetErsatzspieler]: (state: AufstellungState, ersatzspieler: any) => {
		state.ersatzspieler = ersatzspieler;
	},
	[AufstellungMutations.SetInvitablePlayers]: (state: AufstellungState, invitablePlayers: any) => {
		state.invitablePlayers = invitablePlayers;
	},
	[AufstellungMutations.ToggleUpload]: (state: AufstellungState) => {
		state.uploadActive = !state.uploadActive;
	},
	[AufstellungMutations.StopUpload]: (state: AufstellungState) => {
		state.uploadActive = false;
	},
	[AufstellungMutations.SetOpenDialog]: (state: AufstellungState, dialog: any) => {
		state.openDialog = dialog;
	},
	[AufstellungMutations.ToggleLocked]: (state: AufstellungState) => {
		state.locked = !state.locked;
	},
	[AufstellungMutations.AddElement]: (state: AufstellungState, element: element) => {
		state.elements = state.elements.filter(e => e.aufstellung !== element.aufstellung || e.pos !== element.pos);
		state.elements.push(element);
	},
	[AufstellungMutations.SetRaidName]: (state: AufstellungState, raidName: string) => {
		state.raidName = raidName;
	},
	[AufstellungMutations.SetTerminDate]: (state: AufstellungState, terminDate: terminDate) => {
		state.terminDate = terminDate;
	},
};

const actions: AufstellungActionsDefinition = {
	LoadAufstellungen: async (context: ActionContext<AufstellungState, RootState>) => {
		const termin = context.getters.termin;
		const raid = context.getters.raid;
		context.commit(AufstellungMutations.SetAnmeldungen, []);
		context.commit(AufstellungMutations.SetAufstellungen, []);
		context.commit(AufstellungMutations.StopUpload);
		context.commit(AufstellungMutations.SetActive, null);
		context.dispatch(AufstellungActions.CloseDialog);
		context.commit(AufstellungMutations.SetActive, !(await _termine.isArchived(termin.id)));
		context.commit(AufstellungMutations.SetAufstellungen, await _aufstellungen.getForTermin(termin.id));
		context.commit(AufstellungMutations.SetElements, await _aufstellungen.getElements(termin.id));
		if (context.getters.isActive) {
			context.commit(AufstellungMutations.SetLocked, await _termine.isLocked(termin.id));
			context.commit(AufstellungMutations.SetAnmeldungen, await _termine.getAnmeldungenForTermin(termin.id));
			context.commit(AufstellungMutations.SetAnmeldung, await _termine.getAnmeldungForSpieler(termin.id));
			context.commit(AufstellungMutations.SetErsatzspieler, await _termine.getErsatz(termin.id));
			context.commit(AufstellungMutations.SetInvitablePlayers, await _raids.invitablePlayers(raid.id));
			context.commit(AufstellungMutations.StartWSClient, termin);
		}
	},
	LoadAufstellungenPreview: async (
		context: ActionContext<AufstellungState, RootState>,
		terminId: string | number
	) => {
		context.commit(AufstellungMutations.SetAufstellungen, await _preview.getAufstellungen(terminId));
		context.commit(AufstellungMutations.SetElements, await _preview.getElements(terminId));
		context.commit(AufstellungMutations.SetRaidName, await _preview.getRaidName(terminId));
		context.commit(AufstellungMutations.SetTerminDate, await _preview.getTerminDate(terminId));
		context.commit(AufstellungMutations.SetLocked, true);
		context.commit(AufstellungMutations.SetActive, true);
	},
	ClearWS: (context: ActionContext<AufstellungState, RootState>) => {
		if (context.getters.wsClient) {
			context.getters.wsClient.output = null;
		}
	},
	CloseWS: (context: ActionContext<AufstellungState, RootState>) => {
		if (context.getters.wsClient) {
			context.getters.wsClient.close();
		}
	},
	UpdateErsatz: async (context: ActionContext<AufstellungState, RootState>, newValue: any[]) => {
		const oldValue: any[] = context.getters.ersatzIds;
		const termin = context.getters.termin;
		if (oldValue !== null) {
			const invitedPlayer = newValue.find(player => !oldValue.includes(player));
			const deletedPlayer = oldValue.find(player => !newValue.includes(player));
			if (invitedPlayer) {
				await _termine.addErsatz(termin.id, invitedPlayer);
			} else if (deletedPlayer) {
				await _termine.deleteErsatz(termin.id, deletedPlayer);
			}
		}

		const newErsatzspieler = context.getters.invitablePlayers.filter((p: any) => newValue.includes(p.id));
		context.commit(AufstellungMutations.SetErsatzspieler, newErsatzspieler);
	},
	Anmelden: async (context: ActionContext<AufstellungState, RootState>, type: any) => {
		const user = context.getters.loggedInUser;
		const termin = context.getters.termin;
		const changedAnmeldung = context.getters.anmeldungen.find((a: any) => a.id === user.id);
		if (changedAnmeldung) {
			changedAnmeldung.type = type;
		} else {
			context.getters.anmeldungen.push({ id: user.id, name: user.name, type: type });
		}
		await _termine.anmelden(termin.id, type);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	Refresh: async (context: ActionContext<AufstellungState, RootState>) => {
		const termin = context.getters.termin;
		const raid = context.getters.raid;
		context.commit(AufstellungMutations.SetAufstellungen, await _aufstellungen.getForTermin(termin.id));
		context.commit(AufstellungMutations.SetElements, await _aufstellungen.getElements(termin.id));
		context.commit(AufstellungMutations.SetLocked, await _termine.isLocked(termin.id));
		context.commit(AufstellungMutations.SetAnmeldungen, await _termine.getAnmeldungenForTermin(termin.id));
		context.commit(AufstellungMutations.SetAnmeldung, await _termine.getAnmeldungForSpieler(termin.id));
		context.commit(AufstellungMutations.SetErsatzspieler, await _termine.getErsatz(termin.id));
		context.commit(AufstellungMutations.SetInvitablePlayers, await _raids.invitablePlayers(raid.id));
	},
	WsSendRefresh: (context: ActionContext<AufstellungState, RootState>) => {
		if (context.getters.wsClient) {
			context.getters.wsClient.sendRefresh();
		}
	},
	ToggleUpload: (context: ActionContext<AufstellungState, RootState>) => {
		context.commit(AufstellungMutations.ToggleUpload);
	},
	AddBoss: async (context: ActionContext<AufstellungState, RootState>, info: Encounter) => {
		const termin = context.getters.termin;
		if (info.id === 0) {
			if (info.wing != null) {
				context.commit(AufstellungMutations.SetAufstellungen, await _termine.addWing(termin.id, info.wing));
			} else {
				context.commit(AufstellungMutations.SetAufstellungen, await _termine.addStrike(termin.id, info.strike));
			}
			context.commit(AufstellungMutations.SetElements, await _aufstellungen.getElements(termin.id));
		} else {
			context.commit(AufstellungMutations.SetAufstellungen, await _termine.addBoss(termin.id, info.id));
			context.commit(AufstellungMutations.SetElements, await _aufstellungen.getElements(termin.id));
		}
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	DeleteBoss: async (context: ActionContext<AufstellungState, RootState>, aufstellung: any) => {
		const termin = context.getters.termin;
		context.commit(
			AufstellungMutations.SetAufstellungen,
			await _aufstellungen.deleteBoss(aufstellung.id, termin.id)
		);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	OpenDialog: (context: ActionContext<AufstellungState, RootState>, dialog: any) => {
		context.commit(AufstellungMutations.SetOpenDialog, dialog);
	},
	CloseDialog: (context: ActionContext<AufstellungState, RootState>) => {
		context.commit(AufstellungMutations.SetOpenDialog, null);
	},
	Archive: async (context: ActionContext<AufstellungState, RootState>, newTermin: boolean) => {
		context.dispatch(AufstellungActions.CloseDialog);
		if (newTermin) {
			context.dispatch(AufstellungActions.CreateNewTermin);
		}
		await _termine.archive(context.getters.termin.id);
		window.history.back();
	},
	Delete: async (context: ActionContext<AufstellungState, RootState>, newTermin: boolean) => {
		context.dispatch(AufstellungActions.CloseDialog);
		if (newTermin) {
			context.dispatch(AufstellungActions.CreateNewTermin);
		}
		await _termine.deleteTermin(context.getters.termin.id);
		window.history.back();
	},
	CreateNewTermin: async (context: ActionContext<AufstellungState, RootState>) => {
		const termin = context.getters.termin;
		const raid = context.getters.raid;
		const oldDate = termin.dateString.slice(4);
		const dmy = oldDate.split(".");
		const date = new Date(dmy[2], dmy[1] - 1, dmy[0]);
		// I have to add 8 days here to get 7 but I don't know why.
		date.setDate(date.getDate() + 8);
		const dateString = date.toISOString().substr(0, 10);
		await _termine.newTermin(raid.id, dateString, termin.time, termin.endtime);
	},
	ToggleLocked: async (context: ActionContext<AufstellungState, RootState>) => {
		context.commit(AufstellungMutations.ToggleLocked);
		await _termine.putLocked(context.getters.termin.id, context.getters.isLocked);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	/* eslint-disable-next line  @typescript-eslint/no-implicit-any */
	PickClass: async (
		context: ActionContext<AufstellungState, RootState>,
		{ aufstellung, position, clss }: aufstellungPick
	) => {
		let element: element = context.getters.elementForPosition(aufstellung, position);
		if (!element) {
			element = context.getters.dummyElement(aufstellung, position);
		}
		element.class = clss.abbr;
		context.commit(AufstellungMutations.AddElement, element);
		await _aufstellungen.setClass(aufstellung, position, clss.id);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	ClearClass: async (
		context: ActionContext<AufstellungState, RootState>,
		{ aufstellung, position }: aufstellungPick
	) => {
		let element = context.getters.elementForPosition(aufstellung, position);
		if (!element) {
			element = context.getters.dummyElement(aufstellung, position);
		}
		element.class = "";
		context.commit(AufstellungMutations.AddElement, element);
		await _aufstellungen.setClass(aufstellung, position, 0);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	AddRole: async (
		context: ActionContext<AufstellungState, RootState>,
		{ aufstellung, position }: aufstellungPick
	) => {
		let element: element = context.getters.elementForPosition(aufstellung, position);
		if (!element) {
			element = context.getters.dummyElement(aufstellung, position);
		}

		if (!element.roles || element.roles.length <= 0) {
			element.roles.push({ id: 0 } as Role);
		}

		element.roles.push({ id: 0 } as Role);
		const roles = element.roles.map(r => r.id).join(", ");
		context.commit(AufstellungMutations.AddElement, element);
		await _aufstellungen.setRole(aufstellung, position, roles);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	RemoveRole: async (
		context: ActionContext<AufstellungState, RootState>,
		{ aufstellung, position }: aufstellungPick
	) => {
		let element: element = context.getters.elementForPosition(aufstellung, position);
		if (!element) {
			element = context.getters.dummyElement(aufstellung, position);
		}
		element.roles.pop();
		const roles = element.roles.map(r => r.id).join(", ");
		context.commit(AufstellungMutations.AddElement, element);
		await _aufstellungen.setRole(aufstellung, position, roles);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	PickRole: async (
		context: ActionContext<AufstellungState, RootState>,
		{ aufstellung, position, role, idx }: aufstellungPick
	) => {
		let element: element = context.getters.elementForPosition(aufstellung, position);
		if (!element) {
			element = context.getters.dummyElement(aufstellung, position);
		}
		element.roles[idx] = role;
		const roles = element.roles.map(r => r.id).join(", ");
		context.commit(AufstellungMutations.AddElement, element);
		await _aufstellungen.setRole(aufstellung, position, roles);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	ClearRole: async (
		context: ActionContext<AufstellungState, RootState>,
		{ aufstellung, position, idx }: aufstellungPick
	) => {
		let element: element = context.getters.elementForPosition(aufstellung, position);
		if (!element) {
			element = context.getters.dummyElement(aufstellung, position);
		}
		element.roles[idx] = { id: 0 } as Role;
		const roles = element.roles.map(r => r.id).join(", ");
		context.commit(AufstellungMutations.AddElement, element);
		await _aufstellungen.setRole(aufstellung, position, roles);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	PickName: async (
		context: ActionContext<AufstellungState, RootState>,
		{ aufstellung, position, user }: aufstellungPick
	) => {
		let element = context.getters.elementForPosition(aufstellung, position);
		if (!element) {
			element = context.getters.dummyElement(aufstellung, position);
		}
		element.id = user.id;
		element.name = user.name;
		element.accname = user.accname;
		context.commit(AufstellungMutations.AddElement, element);
		await _aufstellungen.setName(aufstellung, position, user.id);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
	ClearName: async (
		context: ActionContext<AufstellungState, RootState>,
		{ aufstellung, position }: aufstellungPick
	) => {
		let element = context.getters.elementForPosition(aufstellung, position);
		if (!element) {
			element = context.getters.dummyElement(aufstellung, position);
		}
		element.id = 0;
		element.name = "???";
		element.accname = "???";
		context.commit(AufstellungMutations.AddElement, element);
		await _aufstellungen.setName(aufstellung, position, 0);
		context.dispatch(AufstellungActions.WsSendRefresh);
	},
};

const getters: AufstellungGettersDefinition = {
	isActive: function(state: AufstellungState) {
		return state.isActive;
	},
	isLocked: function(state: AufstellungState) {
		return state.locked;
	},
	wsClient: function(state: AufstellungState) {
		return state.wsClient;
	},
	wsOutput: function(state: AufstellungState) {
		if (state.wsClient) {
			return state.wsClient.output;
		}
		return null;
	},
	elementForPosition: function(state: AufstellungState) {
		return function(aufstellung: number, position: number) {
			return state.elements.find(e => e.aufstellung === aufstellung && e.pos === position);
		};
	},
	dummyElement: function() {
		return function(aufstellung: number, position: number) {
			return ({
				aufstellung,
				pos: position,
				class: "",
				role: "",
				name: "???",
				accname: "???",
				id: 0,
				roles: [],
			} as unknown) as element;
		};
	},
	isNameDoubled: function(state: AufstellungState) {
		return function(aufstellung: any, name: any) {
			return state.elements.filter(e => e.aufstellung === aufstellung.id && e.name === name).length > 1;
		};
	},
	ersatzSpieler: function(state: AufstellungState) {
		return state.ersatzspieler;
	},
	ersatzIds: function(state: AufstellungState) {
		return state.ersatzspieler.map(p => p.id);
	},
	invitablePlayers: function(state: AufstellungState) {
		return state.invitablePlayers;
	},
	anmeldungen: function(state: AufstellungState) {
		return state.anmeldungen;
	},
	anmeldung: function(state: AufstellungState) {
		return state.anmeldung;
	},
	aufstellungen: function(state: AufstellungState) {
		return state.aufstellungen;
	},
	uploadActive: function(state: AufstellungState) {
		return state.uploadActive;
	},
	isDialogOpen: function(state: AufstellungState) {
		return function(dialog: any) {
			return state.openDialog === dialog;
		};
	},
	raidName: function(state: AufstellungState) {
		return state.raidName;
	},
	terminDate: function(state: AufstellungState) {
		return state.terminDate;
	},
};

const aufstellungModule: Module<AufstellungState, RootState> = {
	state: {
		isActive: null,
		aufstellungen: (null as unknown) as (Aufstellung & Encounter)[],
		elements: [],
		locked: false,
		anmeldungen: [],
		anmeldung: {},
		wsClient: null,
		ersatzspieler: [],
		invitablePlayers: [],
		uploadActive: false,
		openDialog: null,
		raidName: "",
		terminDate: {} as terminDate,
	},
	mutations: mutations,
	actions: actions,
	getters: getters,
};

export default aufstellungModule;
