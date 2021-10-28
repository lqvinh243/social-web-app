<template>
    <div class="theme-default">
        <div class="main-content">
            <div data-app>
                <menu-header @emitDrawer="getDrawer" />
                <div class="col-right" style="overflow: auto;height:calc(100vh - 48px)">
                    <nuxt />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MenuHeader from '~/components/MenuHeader.vue';
import { connectWS } from '~/utils/socket';

export default Vue.extend({
    components: { MenuHeader },

    data: () => ({
        drawer: null,
        items: [
            { title: 'Home', icon: 'mdi-view-dashboard' },
            { title: 'About', icon: 'mdi-forum' }
        ],
    }),

    mounted() {
        // const socket = connectWS(this.$config.wsUrl, 'chat', this.$store.state.auth.accessToken);
        // socket.on('connect', () => {
        //     console.log('Chat channel is connected!');
        // });

        // socket.on('disconnect', () => {
        //     // eslint-disable-next-line no-console
        //     console.log('Bid channel is disconnected!');
        // });

        // if (this.$auth.isAuthenticated()) {
        if (this.$auth.isAuthenticated()) {
            const socket = connectWS(this.$config.wsUrl, 'chat', this.$store.state.auth.accessToken);

            socket.on('connect', () => {
                // eslint-disable-next-line no-console
                console.log('Chat channel is connected!');
            });

            socket.on('disconnect', () => {
                // eslint-disable-next-line no-console
                console.log('Chat channel is disconnected!');
            });

            socket.on('connect_error', (err: Error) => {
                // eslint-disable-next-line no-console
                console.log('connect_error', err);
            });

            socket.on('new_chat', (data:any) => {
                // eslint-disable-next-line no-console
                console.log('new chat', data);
            });
        }

        // // eslint-disable-next-line no-console
        // const socket = connectWS(this.$config.wsUrl, 'tracking');

        // socket.on('connect', () => {
        //     // eslint-disable-next-line no-console
        //     console.log('Tracking channel is connected!');
        // });

        // socket.on('disconnect', () => {
        //     // eslint-disable-next-line no-console
        //     console.log('Tracking channel is disconnected!');
        // });

        // socket.on('connect_error', (err: Error) => {
        //     // eslint-disable-next-line no-console
        //     console.log('connect_error', err);
        // });
    },

    methods: {
        getDrawer() {
            this.drawer = !this.drawer;
        }
    }
});
</script>
