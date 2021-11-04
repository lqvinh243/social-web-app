<template>
    <el-row style="width:700px">
        <el-col :span="10">
            <v-list-item>
                <v-list-item-avatar>
                    <v-img :src="data.avatar" />
                </v-list-item-avatar>

                <v-list-item-content>
                    <nuxt-link :to="`/profile/${data._id}`">
                        <v-list-item-title v-html="data.fullname" />
                    </nuxt-link>
                    <v-list-item-subtitle v-html="getAddress" />
                </v-list-item-content>
            </v-list-item>
        </el-col>
        <el-col v-if="data.isFollow === false" :span="5">
            <el-button :loading="loading" class="mt-4" type="primary" icon="el-icon-circle-plus" @click="followUser(data._id)">
                Follow
            </el-button>
        </el-col>
        <el-col v-else-if="data.isFollow === true && type ==='following'" :span="5">
            <el-button :loading="loading" class="mt-4" type="primary" icon="el-icon-circle-plus" @click="unfollowUser(data._id)">
                UnFollow
            </el-button>
        </el-col>
        <el-col v-else :span="5">
            <el-button class="mt-4" type="primary" icon="el-icon-success" :disabled="true">
                Followed
            </el-button>
        </el-col>
    </el-row>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';

export default {
    middleware: ['authentication'],
    props: {
        user: {
            type: Object,
            default: () => {}
        },
        type: {
            type: String,
            default: () => 'follower'
        }
    },
    data: () => ({
        loading: false,
        data: {}
    }),
    computed: {
        ...mapGetters('auth', ['profile']),
        getAddress():string {
            return this.user.address ?? 'No address';
        }
    },
    mounted() {
        this.data = { ...this.user };
    },
    methods: {
        ...mapActions('auth', ['updateProfile']),

        getBio(user:any): string {
            return user.bio ?? 'No bio for user!';
        },
        async followUser(id: string) {
            this.loading = true;
            const result = await this.$axios.$patch(`/api/v1/user/${id}/follow`)
                .catch((_:any) => {
                    this.$notify.error({
                        title: 'Error',
                        message: 'Some error, please try again!'
                    });
                    this.data.isFollow = false;
                }); ;
            if (result) {
                this.$notify.success({
                    title: 'Success',
                    messsage: 'Follow user sucessfully!'
                });
                this.data.isFollow = true;

                this.loading = true;
            }
            this.loading = false;
        },
        async unfollowUser(id: string) {
            this.loading = true;
            const result = await this.$axios.$patch(`/api/v1/user/${id}/unfollow`)
                .catch((_:any) => {
                    this.$notify.error({
                        title: 'Error',
                        message: 'Some error, please try again!'
                    });
                    this.loading = false;
                }); ;
            if (result) {
                this.$notify.success({
                    title: 'Success',
                    messsage: 'UnFollow user sucessfully!'
                });
                this.data.isFollow = false;
            }
            this.loading = false;
        },
    }

};
</script>

