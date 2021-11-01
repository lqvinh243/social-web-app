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
import { postsService } from '~/services/posts';

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
