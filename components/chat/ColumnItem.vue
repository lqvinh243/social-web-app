<template>
    <div class="message_user active">
        <div class="d-flex p-2 align-items-center justify-content-between w-100">
            <div class="d-flex align-items-center">
                <div class="big-avatar">
                    <v-img :src="displayAvatar" />
                </div>
                <div :class="displayOnline" />

                <div class="ml-1" style="transform: 'translateY(-2px)'">
                    <span class="d-block" v-html="displayName" />
                    <small style="opacity: 0,7" v-html="item.text" />
                </div>
            </div>
        </div>
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
