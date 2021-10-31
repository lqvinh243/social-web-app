import { $axios } from '~/utils/api';

export const commentService = {
    postComment(payload: Object) {
        return $axios.$post('/api/v1/comment', payload);
    },
};
