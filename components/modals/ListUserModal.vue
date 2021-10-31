<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        height="100"
        :lock-scroll="false"
    >
        <v-list>
            <UserListItem v-for="(item,index) in list" :key="index" :type="type" :user="item" />
        </v-list>
    </el-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import UserListItem from '~/components/UserListItem.vue';

export default Vue.extend({
    components: { UserListItem },
    layout: 'default',
    middleware: ['authentication'],
    props: {
        dialogVisible: {
            type: Boolean,
            default: () => false
        },
        type: {
            type: String,
            default: () => 'following'
        }
    },
    data() {
        return {
            list: [] as any[],
            title: 'List following'
        };
    },
    computed: {
        ...mapGetters('auth', ['profile'])
    },
    watch: {
        type(val) {
            switch (val) {
            case 'follower':
                this.getListFollower();
                this.title = 'List follower';
                break;
            case 'following':
                this.getListFollowing();
                this.title = 'List following';
                break;
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getListFollowing();
        });
    },
    methods: {
        ...mapActions('auth', ['updateProfile']),
        async handleClose() {
            this.$emit('closeDialog');
            await this.getInfoUser();
        },
        getListFollower() {
            this.list = this.profile.followers.map((item:any) => ({ ...item, isFollow: item.followers.includes(this.profile._id) }));
            console.log(this.list);
        },
        getListFollowing() {
            this.list = this.profile.following.map((item:any) => ({ ...item, isFollow: true }));
        },

        async getInfoUser() {
            const result = await this.$axios.$get(`/api/v1/user/${this.profile._id}`);
            if (result) {
                this.updateProfile(result.user);
                switch (this.type) {
                case 'follower':
                    this.list = [...result.user.followers.map((item:any) => ({ ...item, isFollow: false }))];
                    break;
                case 'following':
                    this.list = [...result.user.following.map((item:any) => ({ ...item, isFollow: true }))];
                    break;
                }
            }
        }
    }
});
</script>
