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
                </div>
                <div class="info_content">
                    <div class="info_content_title">
                        <h2>{{ profile && profile.fullname || '' }}</h2>
                    </div>

                    <div class="mt-2 follow_btn">
                        <span class="mr-5">
                            {{ totalPost }} Posts
                        </span>
                        <span class="mr-4">
                            {{ profile && profile.followers && profile.followers.length || 0 }} Followers
                        </span>
                        <span class="ml-4">
                            {{ profile && profile.followers && profile.following.length || 0 }} Following
                        </span>
                    </div>
                    <p>Address: {{ profile && profile.address || 'No address' }}</p>
                    <p v-html="describeYourself" />
                </div>
            </div>
        </div>
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
                            <i class="far fa-heart">3</i>
                            <i class="far fa-comment">3</i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center">
            <el-empty :image-size="200" description="No post available" />
        </div>
    </div>
</template>
<script lang="ts">

export default {
    middleware: ['authentication'],
    data() {
        return {
            profile: null as any,
            totalPost: 0,
            posts: [],
            visibleDialog: false,
            visibleDialogAvatar: false,
            userId: null
        };
    },
    computed: {
        avatarUrl(): string {
            return (this.profile && this.profile.avatar) ?? '';
        },
        describeYourself():string {
            return (this.profile && this.profile.describeYourself) ?? '...';
        }
    },
    async mounted() {
        await this.$nextTick(async () => {
            this.userId = this.$route.params.id;
            this.$nuxt.$loading.start();
            await this.getProfile();
            this.getPost();
            this.$nuxt.$loading.finish();
        });
    },
    methods: {
        async getProfile() {
            const result = await this.$axios.$get(`/api/v1/user/${this.userId}`);
            if (result)
                this.profile = result.user;
        },
        async getPost() {
            const result = await this.$axios.$get(`/api/v1/user_posts/${this.userId}`);
            if (result) {
                this.posts = result.posts;
                this.totalPost = result.result;
            }
        },

        resetForm(formName: string) {
            this.$refs[formName].resetFields();
            this.dialogVisible = false;
        },

        replaceByDefault(e:any) {
            e.target.src = require('~/assets/images/avatar-default.png');
        },

        getFirstImage(images: string[]) {
            return images.length ? images[0] : '';
        },

        async getCountPost() {
            const result = await this.$axios.$get(`/api/v1/users/countpost?userId=${this.userId}`);
            this.totalPost = result.numOfPosts;
        }
    }
};
</script>
