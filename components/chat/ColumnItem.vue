<template>
    <div>
        <v-list-item-avatar>
            <v-img :src="displayAvatar" />
        </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title v-html="displayName" />
            <v-list-item-subtitle v-html="item.text" />
        </v-list-item-content>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
    layout: 'default',

    middleware: ['authentication'],

    props: {
        item: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        ...mapGetters('auth', ['profile']),
        displayName():string {
            const user = this.item.recipients.find((item:any) => item._id !== this.profile._id);
            return user ? user.fullname : 'Guest';
        },
        displayAvatar():string {
            const user = this.item.recipients.find((item:any) => item._id !== this.profile._id);
            return user ? user.avatar : '';
        }
    },
    async mounted() {
    }
});
</script>
