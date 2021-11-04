<template>
    <el-card :body-style="{ padding: '0px' }" hadow="hover" class="test">
        <img class="image" style="height:200px;width:200px" :src="user.avatar">
        <div style="padding: 14px;">
            <nuxt-link :to="`/profile/${data._id}`">
                <span>{{ data.fullname }}</span>
            </nuxt-link>
            <div class="bottom clearfix">
                <el-col v-if="!data.isFollow" class="m-0 p-0">
                    <el-button :loading="loading" class="mt-4" type="primary" icon="el-icon-circle-plus" @click="followUser(data._id)">
                        Follow
                    </el-button>
                </el-col>
                <el-col v-else>
                    <el-button class="mt-4" type="primary" icon="el-icon-success" :disabled="true">
                        Followed
                    </el-button>
                </el-col>
            </div>
        </div>
    </el-card>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
export default {
    middleware: ['authentication'],
    props: {
        user: {
            type: Object,
            default: () => {}
        }
    },
    data: () => ({
        loading: false,
        data: {},
    }),
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
                    this.loading = false;
                });
            if (result) {
                this.$notify.success({
                    title: 'Success',
                    messsage: 'Follow user sucessfully!'
                });
                this.data.isFollow = true;
                this.getInfoUser();
            }
            this.loading = false;
        },

        async getInfoUser() {
            const result = await this.$axios.$get(`/api/v1/user/${this.profile._id}`);
            if (result)
                this.updateProfile(result.user);
        }
    }

};
</script>
<style scoped>
.test{
    height: 100% ;
    display: flex;
    flex-direction: column;
    justify-content: space - between;
}

</style>
