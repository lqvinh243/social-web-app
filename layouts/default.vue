<template>
    <div class="theme-default">
        <div class="main-content">
            <div data-app>
                <Menu />
                <div class="col-right">
                    <nuxt />
                    <ChangePasswordModal />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import Menu from '~/components/Menu.vue';
import ChangePasswordModal from '~/components/modals/ChangePasswordModal.vue';
import { connectWS } from '~/utils/socket';
export default Vue.extend({
    components: { Menu, ChangePasswordModal },

    data: () => ({
        drawer: null,
        items: [
            { title: 'Home', icon: 'mdi-view-dashboard' },
            { title: 'About', icon: 'mdi-forum' }
        ],
    }),

    computed: {

    },

    async mounted() {
        const socket = connectWS(this.$config.wsUrl, '', this.$store.state.auth.accessToken);
        socket.on('connect', () => {
            console.log('Socket is connected!');
        });

        socket.on('disconnect', () => {
            // eslint-disable-next-line no-console
            console.log('socket is disconnected!');
        });

        socket.on('user_online', (data) => {
            this.userOnline(data.userId);
        });

        socket.on('user_offline', (data) => {
            this.userOffline(data.userId);
        });

        const result = await this.$axios.$get('/api/v1/user/online');
        if (result)
            this.listUserOnline(result.usersOnline || []);
    },

    methods: {
        ...mapActions('auth', ['listUserOnline', 'userOnline', 'userOffline']),
        getDrawer() {
            this.drawer = !this.drawer;
        }
    }
});
</script>
