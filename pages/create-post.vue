<template>
    <div class="status my-3 d-flex">
        <img
            src="https://res.cloudinary.com/devat-channel/image/upload/v1631811242/v-network/vj9pee0vwrifc1bugijz.jpg"
            class="big-avatar"
        >
        <button class="ml-3 statusBtn flex-fill" @click="openDialogPost">
            nqs, what are you thinking?
        </button>
        <CreatePostModal :dialog-visible-post="dialogVisiblePost" @closeDialogPost="closeDialogPost" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import CreatePostModal from '~/components/modals/CreatePostModal.vue';

export default Vue.extend({
    components: { CreatePostModal },
    layout: 'default',
    middleware: ['authentication'],
    data() {
        return {
            dialogVisiblePost: false
        };
    },
    async mounted() {
    },
    methods: {
        openDialogPost() {
            this.dialogVisiblePost = true;
        },
        closeDialogPost() {
            this.dialogVisiblePost = false;
        }
    }
});
</script>
