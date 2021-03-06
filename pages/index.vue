<template>
    <div class=" container row">
        <div class="col-md-9">
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
        <div class="col-md-3">
            <div
                class="suggestion"
                style="margin-top: 0px;position: fixed;"
            >
                <div class="mt-4">
                    <div class="d-flex justify-content-between align-items-center my-2">
                        <h5 class="text-danger">
                            New User
                        </h5>
                    </div>
                    <div class="suggestions">
                        <div
                            v-for="(item,index) in newUser"
                            :key="index"
                            class="
                      d-flex
                      p-2
                      align-items-center
                      justify-content-between
                      w-100
                    "
                            style="border-bottom: 1px solid #3333;"
                        >
                            <div>
                                <div class="d-flex align-items-center">
                                    <img
                                        :src="item.avatar"
                                        class="big-avatar"
                                    >
                                    <div class="ml-3 mr-3" style="transform: translateY(-2px)">
                                        <nuxt-link :to="`/profile/${item._id}`">
                                            <span class="d-block">{{ item.fullname }}</span>
                                        </nuxt-link>
                                        <small style="opacity: 0.7">
                                            <div style="filter: invert(0)">
                                                Suggested for you
                                            </div>
                                            <div />
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
        dialogVisiblePost: false,
        newUser: [],
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
            Promise.all([
                postsService.getPosts(),
                this.$axios.$get('/api/v1/suggestionsUser')
            ])
                .then(res => {
                    this.postList = res[0].posts;
                    this.newUser = res[1].users.slice(0, 5);
                })
                .catch(() => {
                    this.postList = [];
                    this.newUser = [];
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
        },
    }
});
</script>
