import { $axios } from '~/utils/api';

export const clientService = {
    getClients(query: string) {
        return $axios.$get(`/api/v1/clients?${query}`);
    },

    active(email: string, activeKey: string) {
        return $axios.$post('/api/v1/clients/active', { email, activeKey });
    }
};
