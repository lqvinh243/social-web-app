<template>
    <div>
        <div class="d-flex">
            <v-list-item-avatar>
                <v-img :src="displayAvatar" />
            </v-list-item-avatar>
            <div :class="displayOnline" />
        </div>

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
        ...mapGetters('auth', ['profile', 'usersOnline']),
        displayName():string {
            const user = this.item.recipients.find((item:any) => item._id !== this.profile._id);
            return user ? user.fullname : 'Guest';
        },
        displayAvatar():string {
            const user = this.item.recipients.find((item:any) => item._id !== this.profile._id);
            return user ? user.avatar : '';
        },
        displayOnline():string {
            const user = this.item.recipients.find((item:any) => item._id !== this.profile._id);
            return this.usersOnline.includes(user._id) ? 'point online' : 'point offline';
        }
    },
    async mounted() {
    }
});
</script>
<style scoped>
.point{
    margin-top:0.5rem;
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.online{
    background: #50C761;
}

.offline{
    background: #7E827F;
}
</style>
