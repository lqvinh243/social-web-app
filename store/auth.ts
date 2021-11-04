import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { IRootState } from '.';
import { IUser } from '~/models/user';
import { setCookie } from '~/utils/cookie';

export const namespace = 'auth';
export interface IAuthState {
    accessToken: string | null;
    userId: string | null;
    roleId: string | null;
    profile: IUser | null;
    usersOnline: string[];
    visiableChangePassword: boolean;
    visibleVideoCall: boolean;
    userCallId: string | null;
}

export const state = (): IAuthState => ({
    accessToken: null,
    userId: null,
    roleId: null,
    profile: null,
    usersOnline: [],
    visiableChangePassword: false,
    visibleVideoCall: false,
    userCallId: null
});

export const getters: GetterTree<IAuthState, IRootState> = {
    accessToken: state => state.accessToken,
    userId: state => state.userId,
    roleId: state => state.roleId,
    profile: state => state.profile,
    usersOnline: state => state.usersOnline,
    visiableChangePassword: state => state.visiableChangePassword,
    visibleVideoCall: state => state.visibleVideoCall,
    userCallId: state => state.userCallId
};

export const mutationType = {
    ACCESS_TOKEN: 'access_token',
    USER_ID: 'user_id',
    ROLE_ID: 'role_id',
    PROFILE: 'profile',
    AVATAR: 'avatar',
    LIST_ONLINE: 'list_online',
    USER_ONLINE: 'user_online',
    USER_OFFLINE: 'user_offline',
    UPDATE_VISIBLE_CHANGE_PASSWORD: 'update_visible_change_password',
    UPDATE_VISIBLE_VIDEO_CALL: 'update_visible_video_call',
    UPDATE_USER_CALL: 'update_user_call'
};

export const mutations: MutationTree<IAuthState> = {
    [mutationType.ACCESS_TOKEN]: (state, accessToken: string) => {
        state.accessToken = accessToken;
    },
    [mutationType.USER_ID]: (state, userId: string) => {
        state.userId = userId;
    },
    [mutationType.ROLE_ID]: (state, roleId: string) => {
        state.roleId = roleId;
    },
    [mutationType.PROFILE]: (state, profile: IUser) => {
        state.profile = profile;
    },
    [mutationType.AVATAR]: (state, avatar: string) => {
        if (state.profile)
            state.profile.avatar = avatar;
    },
    [mutationType.LIST_ONLINE]: (state, usersOnline: string[]) => {
        state.usersOnline = usersOnline;
    },
    [mutationType.USER_ONLINE]: (state, userId: string) => {
        if (!state.usersOnline.find(item => item === userId))
            state.usersOnline.push(userId);
    },
    [mutationType.USER_OFFLINE]: (state, userId: string) => {
        state.usersOnline = state.usersOnline.filter(item => item !== userId);
    },
    [mutationType.UPDATE_VISIBLE_CHANGE_PASSWORD]: (state, isVisible: boolean) => {
        state.visiableChangePassword = isVisible;
    },
    [mutationType.UPDATE_VISIBLE_VIDEO_CALL]: (state, isVisible: boolean) => {
        state.visibleVideoCall = isVisible;
    },
    [mutationType.UPDATE_USER_CALL]: (state, userId: string | null) => {
        state.userCallId = userId;
    }
};

export const actions: ActionTree<IAuthState, IRootState> = {
    updateProfile({ commit }, profile: IUser) {
        commit(mutationType.PROFILE, profile);
    },
    updateAuthentication({ commit }, userAuth: {token: string, userId: string, roleId: string}) {
        commit(mutationType.ACCESS_TOKEN, userAuth.token);
        commit(mutationType.USER_ID, userAuth.userId);
        commit(mutationType.ROLE_ID, userAuth.roleId);
        if (process.client)
            setCookie('token', userAuth.token, 24 * 60 * 60);
    },
    clearAuthentication({ commit }) {
        commit(mutationType.ACCESS_TOKEN, null);
        commit(mutationType.USER_ID, null);
        commit(mutationType.ROLE_ID, null);
        commit(mutationType.PROFILE, null);

        if (process.client)
            setCookie('token', '', -1);
    },

    updateAvatar({ commit }, avatar: string) {
        commit(mutationType.AVATAR, avatar);
    },

    listUserOnline({ commit }, usersOnline: string[]) {
        commit(mutationType.LIST_ONLINE, usersOnline);
    },

    userOnline({ commit }, userId) {
        commit(mutationType.USER_ONLINE, userId);
    },

    userOffline({ commit }, userId) {
        commit(mutationType.USER_OFFLINE, userId);
    },

    updateVisibleChangePassword({ commit }, isVisible: boolean) {
        commit(mutationType.UPDATE_VISIBLE_CHANGE_PASSWORD, isVisible);
    },

    updateVisibleVideoCall({ commit }, isVisible: boolean) {
        commit(mutationType.UPDATE_VISIBLE_VIDEO_CALL, isVisible);
    },

    updateUserCall({ commit }, userId: string | null) {
        commit(mutationType.UPDATE_USER_CALL, userId);
    }
};
