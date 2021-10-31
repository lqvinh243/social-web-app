import { $axios } from '~/utils/api';

export const postsService = {
    getPosts() {
        return $axios.$get('/api/v1/posts');
    },
};
