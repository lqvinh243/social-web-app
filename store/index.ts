import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { authService } from '~/services/auth';
import { namespace as authNamespace } from '~/store/auth';
import { getCookie } from '~/utils/cookie';

export interface IRootState {}

export const state = (): IRootState => ({
});

export const getters: GetterTree<IRootState, IRootState> = {
};

export const mutationType = {
};

export const mutations: MutationTree<IRootState> = {
};

export const actions: ActionTree<IRootState, IRootState> = {
    async nuxtServerInit({ dispatch }, { req, res }) {
        const token = getCookie('token', req.headers.cookie);

        if (token) {
            try {
                const authResult = await authService.authenticate(token);

                dispatch(`${authNamespace}/updateAuthentication`, { ...authResult, token });
                dispatch(`${authNamespace}/updateProfile`, { ...authResult });
            }
            catch (err) {
                res.setHeader('set-cookie', 'token=; max-age=0');
                dispatch(`${authNamespace}/clearAuthentication`);
            }
        }
    }
};
