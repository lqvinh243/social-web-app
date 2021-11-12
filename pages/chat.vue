<template>
    <div class="message d-flex">
        <!-- <el-row>
            <h1>Your chat message</h1>
        </el-row> -->
        <div class="col-md-4 border-right px-0 left_mess">
            <chat-column @channel="channelSelect" />
        </div>
        <div class="col-md-8 px-0">
            <chat-area :channel="channel" />
        </div>
    </div>
</template>

<script lang="ts">
import ChatArea from '~/components/chat/ChatArea.vue';
import ChatColumn from '~/components/chat/ChatColumn.vue';
export default {
    components: { ChatArea, ChatColumn },
    layout: 'default',
    middleware: ['authentication'],
    data() {
        return {
            channel: null
        };
    },
    methods: {
        channelSelect(channel: string) {
            this.channel = channel;
        }
    }
};
</script>

