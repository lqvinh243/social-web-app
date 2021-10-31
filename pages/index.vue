<template>
    <div class="home row mx-0">
        <div class="col-md-8">
            <div class="status my-3 d-flex">
                <img src="https://res.cloudinary.com/devat-channel/image/upload/v1631811242/v-network/vj9pee0vwrifc1bugijz.jpg" class="big-avatar">
                <button class="ml-3 statusBtn flex-fill">
                    nqs, what are you thinking?
                </button>
            </div>
            <div v-for="(item,index) in postList" :key="index" class="posts">
                <div class="card my-3">
                    <div class="card_header">
                        <div class="d-flex">
                            <img src="https://res.cloudinary.com/devat-channel/image/upload/v1631811242/v-network/vj9pee0vwrifc1bugijz.jpg" class="big-avatar">
                            <div class="card_name">
                                <h6 class="m-0">
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
                        <div class="card_body-content" style="filter: invert(1); color: white">
                            <div v-html="item.content" />
                        </div>
                        <div class="carousel slide" data-ride="carousel">
                            <ol class="carousel-indicators" style="z-index: 1">
                                <li data-target="#image1" data-slide-to="0" class="active" />
                            </ol>
                            <div class="carousel-inner">
                                <div v-for="(image,index) in item.images" :key="index" class="carousel-item" :class="{'active': index === 0}">
                                    <img :src="image">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card_footer">
                        <div class="card_icon_menu">
                            <div class="card-icon-menu-react">
                                <i class="far fa-heart" />
                                <img src="../assets/images/send.svg" alt="Send">
                            </div>
                            <i class="far fa-bookmark" />
                        </div>
                        <div class="d-flex justify-content-between">
                            <h6 style="padding: 0 25px; cursor: pointer">
                                <div v-if="item.likes.length > 0">
                                    {{ item.likes.length }}  likes
                                </div>
                            </h6>
                            <h6 style="padding: 0 25px; cursor: pointer">
                                <div>{{ item.comments.length === 0 ? 'No' : item.comments.length }} comments</div>
                            </h6>
                        </div>
                    </div>
                    <div v-if="item.comments.length > 0" class="comments">
                        <div v-for="(comment, index) in item.comments" :key="index" class="comment_display">
                            <div
                                class="comment_card mt-2"
                                style="opacity:  1 ;
                    pointerEvents:  inherit"
                            >
                                <div class="d-flex text-dark">
                                    <img :src="comment.user.avatar">
                                    <h6 class="mx-1">
                                        {{ comment.user.fullname || '' }}
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
                                            <div class="mr-1">
                                                @{{ comment.tag }}
                                            </div>

                                            <div v-html="comment.content" />
                                        </div>

                                        <div style="cursor: pointer">
                                            <small class="text-muted mr-3">
                                                {{ new Date(comment.updatedAt).toISOString().substring(0, 10) }}
                                            </small>

                                            <small v-if="comment.likes.length > 0" class="font-weight-bold mr-3">
                                                <div> {{ comment.likes.length }} likes</div>
                                            </small>

                                            <!-- <small class="font-weight-bold mr-3">
                                                update
                                            </small>

                                            <small class="font-weight-bold mr-3">
                                                reply
                                            </small> -->
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
                                        <!-- <i class="far fa-heart"/> -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- <div class="p-2 border-top" style="cursor: pointer; color: crimson"  >
                            See more comments...
                        </div> -->
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
                        <button class="postBtn" @click="submitComment({postId: item._id, content, tag:'1', reply:null, postUserId: item.user._id })">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">

import Vue from 'vue';
import { commentService } from '~/services/comment';
import { postsService } from '~/services/posts';

export default Vue.extend({
    layout: 'default',
    middleware: ['authentication'],
    data: () => ({
        postList: [],
        content: ''
    }),
    mounted() {
        this.init();
    },
    methods: {
        submitComment(value: Object) {
            this.$nuxt.$loading.start();
            commentService.postComment(value)
                .then(() => {
                    this.content = '';
                    this.init();
                })
                .finally(() => {
                    this.$nuxt.$loading.finish();
                });
        },
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
        }
    }
});
</script>
