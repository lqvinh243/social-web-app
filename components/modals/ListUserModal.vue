<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >
        <v-list>
            <UserListItem v-for="(item,index) in list" :key="index" :user="item" />
        </v-list>
    </el-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
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
            default: () => 'follower'
        }
    },
    data() {
        return {
            list: [] as any[],
            title: 'List follower'
        };
    },
    computed: {
        ...mapGetters('auth', ['profile'])
    },
    watch: {
        type(val) {
            console.log(val);
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
        this.getListFollower();
    },
    methods: {
        handleClose() {
            this.$emit('closeDialog');
        },
        getListFollower() {
            this.list = this.profile.followers;
        },
        getListFollowing() {
            this.list = this.profile.following;
        }
    }
});
</script>
