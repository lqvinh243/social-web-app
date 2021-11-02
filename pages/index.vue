<template>
    <div class=" container">
        <div>
            <div class="status my-3 d-flex">
                <img
                    :src="getAvatar"
                    class="big-avatar"
                >
                <button class="ml-3 statusBtn flex-fill" @click="openDialogPost">
                    {{ getName }}, what are you thinking?
                </button>
                <CreatePostModal :dialog-visible-post="dialogVisiblePost" @closeDialogPost="closeDialogPost" />
            </div>
            <div v-for="(item) in postList" :key="item._id" class="posts">
                <PostItem :item="item" />
            </div>
            <div v-if="!postList.length" class="text-center">
                <el-empty :image-size="200" description="No post available" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">

import Vue from 'vue';
import { mapGetters } from 'vuex';
import CreatePostModal from '~/components/modals/CreatePostModal.vue';
import PostItem from '~/components/PostItem.vue';
import eventBus from '~/plugins/event-bus';
import { postsService } from '~/services/posts';
import { connectWS } from '~/utils/socket';

export default Vue.extend({
    components: { PostItem, CreatePostModal },
    layout: 'default',
    middleware: ['authentication'],
    data: () => ({
        postList: [],
        content: '',
        dialogVisiblePost: false

    }),
    computed: {
        ...mapGetters('auth', ['profile']),
        getName(): string {
            return this.profile.fullname;
        },
        getAvatar():string {
            return this.profile.avatar;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
        });

        const socket = connectWS(this.$config.wsUrl, 'like', this.$store.state.auth.accessToken);
        socket.on('connect', () => {
            console.log('Like channel is connected!');
        });

        socket.on('disconnect', () => {
            // eslint-disable-next-line no-console
            console.log('socket is disconnected!');
        });

        socket.on('like_post', (data) => {
            eventBus.$emit('LIKE_POST', data);
        });

        socket.on('unlike_post', (data) => {
            eventBus.$emit('UNLIKE_POST', data);
        });

        const socketComment = connectWS(this.$config.wsUrl, 'comment', this.$store.state.auth.accessToken);
        socketComment.on('connect', () => {
            console.log('Comment channel is connected!');
        });

        socketComment.on('disconnect', () => {
            // eslint-disable-next-line no-console
            console.log('socketComment is disconnected!');
        });

        socketComment.on('comment_post', (data) => {
            eventBus.$emit('COMMENT_POST', data);
        });
    },

    destroyed() {
        eventBus.$destroy();
    },

    methods: {
        init() {
            this.$nuxt.$loading.start();
            postsService.getPosts()
                .then(res => {
                    this.postList = res.posts;
                })
                .catch(() => {
                    this.postList = [];
                })
                .finally(() => {
                    this.$nuxt.$loading.finish();
                });
        },
        openDialogPost() {
            this.dialogVisiblePost = true;
        },
        closeDialogPost() {
            this.dialogVisiblePost = false;
        }
    }
});
</script>
