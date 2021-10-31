<template>
    <div class="profile">
        <div class="info">
            <div class="info_container">
                <div>
                    <div>
                        <img
                            :src="avatarUrl"
                            class="supper-avatar"
                        >
                    </div>
                    <el-button @click="openChangeAvatar">
                        Change avatar
                    </el-button>
                </div>
                <div class="info_content">
                    <div class="info_content_title">
                        <h2>{{ (myProfile && myProfile.fullname) || '' }}</h2>

                        <button class="btn btn btn-light btn-sm" @click="handleOpenUpdate">
                            Edit Profile
                        </button>
                    </div>

                    <div class="mt-2 follow_btn">
                        <span class="mr-5">
                            {{ totalPost }} Posts
                        </span>
                        <span class="mr-4" @click="showListUser('follower')">
                            {{ (profile && profile.followers && profile.followers.length) || 0 }} Followers
                        </span>
                        <span class="ml-4" @click="showListUser('following')">
                            {{ (profile && profile.followers && profile.following.length) || 0 }} Following
                        </span>
                    </div>
                    <div>Address: {{ (myProfile && myProfile.address) || 'No address' }}</div>
                    <div v-html="describeYourself" />
                </div>
            </div>
        </div>
        <el-tabs v-model="activeName" class="ml-4" @tab-click="handleClick">
            <el-tab-pane label="Post" name="posts" />
            <el-tab-pane label="Save post" name="save-posts" />
        </el-tabs>
        <!--Grid-->
        <div v-if="posts.length">
            <div class="post_thumb">
                <div v-for="post in posts" :key="post._id">
                    <div class="post_thumb_display">
                        <img
                            :src="getFirstImage(post.images)"
                            alt=""
                            style="filter: invert(0)"
                        >

                        <div class="post_thumb_menu">
                            <i class="far fa-heart">{{ post.likes.length }}</i>
                            <i class="far fa-comment">{{ post.comments.length }}</i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center">
            <el-empty :image-size="200" description="No post available" />
        </div>
        <ChangeProfileModal :dialog-visible="visibleDialog" @closeDialog="closeDialog" />
        <UploadAvatarModal :dialog-visible-avatar="visibleDialogAvatar" @closeDialogAvatar="closeDialogAvatar" />
        <ListUserModal :dialog-visible="visibleDialogUserList" :type="showListType" @closeDialog="closeDialogUserList" />
    </div>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import ChangeProfileModal from '~/components/modals/ChangeProfileModal.vue';
import ListUserModal from '~/components/modals/ListUserModal.vue';
import UploadAvatarModal from '~/components/modals/UploadAvatarModal.vue';

export default {
    components: { ChangeProfileModal, UploadAvatarModal, ListUserModal },
    middleware: ['authentication'],
    data() {
        return {
            myProfile: null as any,
            totalPost: 0,
            posts: [],
            visibleDialog: false,
            visibleDialogAvatar: false,
            visibleDialogUserList: false,
            showListType: 'following',
            activeName: 'posts'
        };
    },
    computed: {
        ...mapGetters('auth', ['profile', 'roleId']),
        avatarUrl(): string {
            return (this.myProfile && this.myProfile.avatar) ?? '';
        },
        describeYourself():string {
            return (this.profile && this.profile.describeYourself) ?? '...';
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$nuxt.$loading.start();
            this.myProfile = { ...this.profile };
            this.getPost();
            this.getCountPost();
            this.$nuxt.$loading.finish();
        });
    },
    methods: {
        async getPost() {
            const result = await this.$axios.$get(`/api/v1/user_posts/${this.profile._id}`);
            if (result)
                this.posts = result.posts;
        },

        async getSavePost() {
            const result = await this.$axios.$get('/api/v1/getSavePosts');
            if (result)
                this.posts = result.savePosts;
        },

        resetForm(formName: string) {
            this.$refs[formName].resetFields();
            this.dialogVisible = false;
        },

        handleChangeImage(e:any) {
            if (e.target.files && e.target.files.length) {
                const file = e.target.files[0];
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL(file);
                const image :any = document.getElementById('avatar');
                if (image)
                    image.src = imageUrl;
                this.avatarUpload = file;
            }
        },

        replaceByDefault(e:any) {
            e.target.src = require('~/assets/images/avatar-default.png');
        },

        getFirstImage(images: string[]) {
            return images.length ? images[0] : '';
        },

        handleOpenUpdate() {
            this.visibleDialog = true;
        },

        closeDialog() {
            this.visibleDialog = false;
        },

        openChangeAvatar() {
            this.visibleDialogAvatar = true;
        },

        closeDialogAvatar(url: string) {
            this.visibleDialogAvatar = false;
            if (url)
                this.myProfile.avatar = url;
        },

        showListUser(type: string) {
            this.showListType = type;
            this.visibleDialogUserList = true;
        },

        closeDialogUserList() {
            this.visibleDialogUserList = false;
        },

        async  handleClick() {
            this.$nuxt.$loading.start();
            this.posts = [];
            switch (this.activeName) {
            case 'posts':
                await this.getPost();
                break;

            case 'save-posts':
                await this.getSavePost();
                break;
            }
            this.$nuxt.$loading.finish();
        },

        async getCountPost() {
            const result = await this.$axios.$get('/api/v1/users/countpost');
            this.totalPost = result.numOfPosts;
        }
    }
};
</script>
