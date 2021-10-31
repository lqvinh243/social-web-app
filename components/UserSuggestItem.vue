<template>
    <el-card :body-style="{ padding: '0px' }" hadow="hover" class="test">
        <img class="image" style="height:200px" :src="user.avatar">
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
        currentDate: 'abc'
    }),
    mounted() {
        this.data = { ...this.user };
        console.log(this.data);
    },
    methods: {
        getBio(user:any): string {
            return user.bio ?? 'No bio for user!';
        },
        async followUser(id: string) {
            this.loading = true;
            const result = await this.$axios.$patch(`/api/v1/user/${id}/follow`);
            if (result) {
                this.$notify.success({
                    title: 'Success',
                    messsage: 'Follow user sucessfully!'
                });
                this.data.isFollow = true;
            }
            this.loading = false;
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
