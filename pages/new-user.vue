<template>
    <el-container class="h-100 w-75 mx-auto mt-4">
        <v-list v-if="!!total">
            <template v-for="(item, index) in users">
                <!-- <el-row :key="index" style="width:800px">
                    <el-col :span="15">
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-img :src="item.avatar" />
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title v-html="item.fullname" />
                                <v-list-item-subtitle v-html="getBio(item)" />
                            </v-list-item-content>
                        </v-list-item>
                    </el-col>
                    <el-col v-if="!item.isFollow" :span="5">
                        <el-button class="mt-4" type="primary" icon="el-icon-circle-plus" @click="followUser(item._id)">
                            Follow
                        </el-button>
                    </el-col>
                    <el-col v-else :span="5">
                        <el-button class="mt-4" type="primary" icon="el-icon-success" :disabled="true" @click="followUser(item._id)">
                            Followed
                        </el-button>
                    </el-col>
                </el-row> -->
                <UserSuggestItem :key="index" :user="item" />
            </template>
        </v-list>
        <div v-else>
            <h1>No data</h1>
        </div>
    </el-container>
</template>

<script lang="ts">
import UserSuggestItem from '~/components/UserSuggestItem.vue';

export default {
    components: { UserSuggestItem },
    middleware: ['authentication'],
    data: () => ({
        items: [
            {
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                title: 'Brunch this weekend?',
                subtitle: '<span class="text--primary">Ali Connors</span> &mdash; I\'ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
            },
            {
                avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
                title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
                subtitle: '<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I\'m out of town this weekend.',
            },
            {
                avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
                title: 'Oui oui',
                subtitle: '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
            },
            {
                avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
                title: 'Birthday gift',
                subtitle: '<span class="text--primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
            },
            {
                avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
                title: 'Recipe to try',
                subtitle: '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
            },
        ],
        total: 0,
        users: []
    }),
    async mounted() {
        const result = await this.$axios.$get('/api/v1/suggestionsUser');
        this.total = result.result;
        this.users = result.users.map((item:any) => ({ ...item, isFollow: false }));
    },
    methods: {
        getBio(user:any): string {
            return user.bio ?? 'No bio for user!';
        },
        async  followUser(id: string) {
            const result = await this.$axios.$patch(`/api/v1/user/${id}/follow`);
            if (result) {
                this.$notify.success({
                    title: 'Success',
                    messsage: 'Follow user sucessfully!'
                });
                const item = this.users.find((item:any) => item._id === id);
                item.isFollow = true;
            }
        }
    }

};
</script>

