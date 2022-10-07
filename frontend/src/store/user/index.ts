import { ActionContext, Module } from "vuex";

import _users from '../../services/endpoints/users';
import _build from '../../services/endpoints/build';
import { UserActions, UserActionsDefinition, UserGettersDefinition, UserMutations, UserMutationsDefinition, UserState } from '@/models/Store/UserState';
import { RootState } from "@/models/Store/RootState";
import { Spieler } from "models/Spieler";

const getters: UserGettersDefinition = {
	loggedInUser: state => {
		return state.loggedInUser
	},
	loginSuccess: state => state.loginState === 1,
	loginFailed: state => state.loginState === -1,
	frontendBuild: state => state.frontendBuild,
	backendBuild: state => state.buildCheck === 'Success' ? state.frontendBuild : state.buildCheck,
	buildCheck: state => state.buildCheck === 'Success',
	selectedTheme: state => state.loggedInUser.theme
};

const mutations: UserMutationsDefinition = {
	[UserMutations.SetLoggedInUser]: (state: UserState, user: Spieler) => {
		state.loggedInUser = user;
	},
	[UserMutations.SetLoginState]: (state: UserState, id: number) => {
		state.loginState = id;
	},
	[UserMutations.SetUserName]: (state: UserState, name: string) => {
		state.loggedInUser.name = name;
	},
	[UserMutations.SetBuildCheck]: (state: UserState, success: any) => {
		state.buildCheck = success;
	},
	[UserMutations.SetSelectedTheme]: (state: UserState, theme: number) => {
		state.loggedInUser.theme = theme;
	}
};

const actions: UserActionsDefinition = {
	[UserActions.CheckBuild]: async (context: ActionContext<UserState, RootState>) => {
		const successState = await _build.checkBuild(context.getters.frontendBuild);
		context.commit(UserMutations.SetBuildCheck, successState);
	},
	[UserActions.ChangeUserName]: async (context: ActionContext<UserState, RootState>, payload: string) => {
		await _users.changeName(payload);
		context.commit(UserMutations.SetUserName, payload);
	},
	[UserActions.GetLoggedInUser]: async (context: ActionContext<UserState, RootState>) => {
		const user = await _users.get();
        if (!Array.isArray(user) || user.length > 0) {
            // this.user = user;
            context.commit(UserMutations.SetLoggedInUser, user);
            context.commit(UserMutations.SetLoginState, 1);
        } else {
            context.commit(UserMutations.SetLoginState, -1);
        }
	},
	[UserActions.SetSelectedTheme]: async (context: ActionContext<UserState, RootState>, payload: number) => {
		await _users.updateTheme(payload);
		context.commit(UserMutations.SetSelectedTheme, payload);
	}
};

const UserModule: Module<UserState, RootState> = {
    state: {
        loggedInUser: {} as Spieler,
        loginState: 0,
        buildCheck: null,
        frontendBuild: 'v2.4.3',
    },
    mutations: mutations,
	actions: actions,
    getters: getters,
}

export default UserModule;