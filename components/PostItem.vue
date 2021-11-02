<template>
    <div class="card my-3">
        <div class="card_header">
            <div class="d-flex">
                <img :src="item.user.avatar" class="big-avatar">
                <div class="card_name ml-1">
                    <h6>
                        <div class="text-dark">
                            {{ item.user.fullname || '' }}
                        </div>
                    </h6>
                    <small class="text-muted">{{ new Date(item.updatedAt).toISOString().substring(0, 10) }}</small>
                </div>
            </div>
            <div class="nav-item dropdown">
                <span id="moreLink" class="material-icons" data-toggle="dropdown">
                    more_horiz
                </span>
                <div class="dropdown-menu">
                    <div class="dropdown-item">
                        <span class="material-icons">create</span>
                        Edit Post
                    </div>
                    <div class="dropdown-item">
                        <span class="material-icons">delete_outline</span>
                        Remove Post
                    </div>
                    <div class="dropdown-item">
                        <span class="material-icons">content_copy</span>
                        Copy Link
                    </div>
                </div>
            </div>
        </div>
        <div class="card_body">
            <div class="demo-image__preview text-center">
                <el-image
                    style="width: 400px; height: 400px;"
                    :src="item.images[0]"
                    :preview-src-list="item.images"
                />
            </div>
        </div>
        <div class="card_footer">
            <div class="card_icon_menu">
                <div class="card-icon-menu-react">
                    <i class="far fa-heart" :style="{color: isLike === true ? 'red' : 'black' }" @click="handleLike" />
                </div>
                <i class="far fa-bookmark" :style="{color: isSave === true ? '#58FAF4' : 'black' }" @click="handleSavePost" />
            </div>
            <div class="d-flex justify-content-between">
                <h6 style="padding: 0 25px; cursor: pointer">
                    <div v-if="likes.length > 0">
                        {{ likes.length }}  likes
                    </div>
                </h6>
                <h6 style="padding: 0 25px; cursor: pointer">
                    <div>{{ comments.length === 0 ? 'No' : comments.length }} comments</div>
                </h6>
            </div>
        </div>
        <div v-if="comments.length > 0" class="comments">
            <div v-for="index in commentLength" :key="index" class="comment_display" style="transform: rotate(180deg);">
                <div
                    v-if="index - 1 < comments.length"
                    class="comment_card mt-2"
                    style="opacity:  1 ;
                    pointerEvents:  inherit; transform: rotate(-180deg); "
                >
                    <div class="d-flex text-dark">
                        <div class="block">
                            <el-avatar :size="50" :src="comments[index - 1].user.avatar" />
                        </div>
                        <h6 class="mx-1 mt-2">
                            {{ comments[index - 1].user.fullname || '' }}
                        </h6>
                    </div>

                    <div class="comment_content">
                        <div
                            class="flex-fill"
                            style="
                              filter: 'invert(1)';
                              color: 'white'
                          "
                        >
                            <div>
                                <div v-if="comments[index - 1].tag" class="mr-1">
                                    @{{ comments[index - 1].tag }}
                                </div>

                                <div v-html="comments[index - 1].content" />
                            </div>

                            <div style="cursor: pointer">
                                <small class="text-muted mr-3">
                                    {{ showTime(comments[index - 1].createdAt) }}
                                </small>

                                <small v-if="comments[index - 1].likes && comments[index - 1].likes.length > 0" class="font-weight-bold mr-3">
                                    <div> {{ comments[index - 1].likes.length }} likes</div>
                                </small>
                            </div>
                        </div>

                        <div class="d-flex align-items-center mx-2" style="cursor: pointer">
                            <div class="menu">
                                <div class="nav-item dropdown">
                                    <span id="moreLink" class="material-icons" data-toggle="dropdown">
                                        more_vert
                                    </span>

                                    <div class="dropdown-menu" aria-labelledby="moreLink">
                                        <div class="dropdown-item">
                                            <span class="material-icons">create</span> Edit
                                        </div>
                                        <div class="dropdown-item">
                                            <span class="material-icons">delete_outline</span> Remove
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="commentLength < item.comments.length" class="p-2 border-top" style="cursor: pointer; color: crimson" @click="seeMoreComment">
                See more comments...
            </div>
        </div>
        <div class="card-footer comment_input">
            <input
                v-model="content"
                type="text"
                placeholder="Add your comments..."
                value=""
                style="
                              filter: invert(1);
                              color: white;
                              background: rgba(0, 0, 0, 0.03);
                            "
            >
            <button class="postBtn" @click="submitComment({postId: item._id, content, reply:null, postUserId: item.user._id })">
                Post
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import moment from 'moment';
import eventBus from '~/plugins/event-bus';
import { commentService } from '~/services/comment';

export default {
    props: {
        item: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            id: null,
            content: '',
            commentLength: 1,
            comments: [],
            likes: [],
            saves: [],
            isLike: false,
            isSave: false
        };
    },
    computed: {
        ...mapGetters('auth', ['profile'])
    },
    mounted() {
        this.id = this.item._id;
        this.comments = this.item.comments;
        this.comments = this.comments.reverse();
        this.likes = this.item.likes;
        this.isLike = !!(this.likes.find((item:any) => item._id === this.profile._id));
        this.saves = [...this.profile.saved];
        this.isSave = this.saves.includes(this.item._id);

        eventBus.$on('LIKE_POST', (data:any) => {
            if (this.id === data.id && this.profile._id !== data.user._id)
                this.likes = this.likes.concat(data);
        });

        eventBus.$on('UNLIKE_POST', (data:any) => {
            if (this.id === data.id && this.profile._id !== data.user._id)
                this.likes = this.likes.filter((item:any) => item._id !== data.user._id);
        });

        eventBus.$on('COMMENT_POST', (data:any) => {
            this.comments.unshift(data);
            if (this.commentLength !== 1)
                this.commentLength++;
        });
    },

    destroyed() {
        eventBus.$destroy();
    },

    methods: {
        submitComment(value: Object) {
            this.$nuxt.$loading.start();
            commentService.postComment(value)
                .then((item) => {
                    this.content = '';
                    item.newComment.user = { ...this.profile };
                    this.comments.unshift(item.newComment);
                    this.commentLength++;
                })
                .finally(() => {
                    this.$nuxt.$loading.finish();
                });
        },
        handleLike() {
            if (this.isLike)
                this.unlikePost();

            else
                this.likePost();
        },
        async likePost() {
            this.isLike = true;
            this.likes = this.likes.concat({ ...this.profile });
            await this.$axios.$patch(`/api/v1/post/${this.item._id}/like`).catch(() => {
                this.$notify.success({
                    title: 'Error',
                    message: 'Sorry, some error!'
                });
                this.isLike = false;
                this.likes = this.likes.filter((item:any) => item._id !== this.profile._id);
            });
        },
        async unlikePost() {
            this.isLike = false;
            this.likes = this.likes.filter((item:any) => item._id !== this.profile._id);
            await this.$axios.$patch(`/api/v1/post/${this.item._id}/unlike`).catch(() => {
                this.$notify.success({
                    title: 'Error',
                    message: 'Sorry, some error!'
                });
                this.isLike = true;
                this.likes = this.likes.concat({ ...this.profile });
            });
        },
        async savePost() {
            this.isSave = true;
            await this.$axios.$patch(`/api/v1/savePost/${this.item._id}`).catch(() => {
                this.$notify.success({
                    title: 'Error',
                    message: 'Sorry, some error!'
                });
                this.isSave = false;
            });
        },
        async unSavePost() {
            this.isSave = false;
            await this.$axios.$patch(`/api/v1/unSavePost/${this.item._id}`).catch(() => {
                this.$notify.success({
                    title: 'Error',
                    message: 'Sorry, some error!'
                });
                this.isSave = true;
            });
        },
        handleSavePost() {
            if (this.isSave === false)
                this.savePost();
            else this.unSavePost();
        },
        seeMoreComment() {
            this.commentLength += 1;
        },

        showTime(time:any) {
            return moment(time).fromNow();
        }
    }
};
</script>

