import { $axios } from '~/utils/api';

export const authService = {
    authenticate(token: string) {
        return $axios.$post('/api/v1/auths', { token }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
    },

    login(email: string, password: string) {
        return $axios.$post('/api/v1/auths/login', { email, password });
    },

    register(data: any) {
        return $axios.$post('/api/v1/auths/register', data);
    },

    updatePassword(oldPassword: string, password: string) {
        return $axios.$patch('/api/v1/auths/password', { oldPassword, password });
    },

    verifyCapcha(response: string) {
        return $axios.$post('/api/v1/auths/verify-capcha', { response });
    },

    forgotPassword(data: any) {
        return $axios.$post('/api/v1/auths/forgot-password', data);
    },

    resetPassword(data: any) {
        return $axios.$post('/api/v1/auths/reset-password', data);
    }
};
