<template>
    <div class="h-100 mx-auto mt-4 w-75">
        <el-row v-if="users && users.length > 0" :gutter="5">
            <el-col v-for="(item, index) in users" :key="index" :span="4.5">
                <UserSuggestItem :user="item" />
            </el-col>
        </el-row>
        <div v-else>
            <el-alert
                type="warning"
                description="Not Find Users. Please try again !!"
            />
        </div>
    </div>
</template>

<script>
import UserSuggestItem from '~/components/UserSuggestItem.vue';
export default {
    components: { UserSuggestItem },
    layout: 'default',
    middleware: ['authentication'],
    data: () => ({
        users: [],
    }),
    async mounted() {
        await this.$nextTick(async () => {
            const textSearch = this.$route.params.id;
            if (textSearch.length > 0) {
                this.$nuxt.$loading.start();
                const { users } = await this.$axios.$get(`api/v1/search?fullname=${textSearch}`);
                this.users = users;
                this.$nuxt.$loading.finish();
            }
        });
    }
};
</script>

<style>

</style>
