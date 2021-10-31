<template>
    <div class="h-100 w-75 mx-auto mt-4">
        <el-row>
            <h1>Your chat message</h1>
        </el-row>
        <el-row :gutter="20" class="w-100 h-100">
            <el-col :span="8">
                <chat-column @channel="channelSelect" />
            </el-col>
            <el-col :span="12">
                <chat-area :channel="channel" />
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import ChatArea from '~/components/chat/ChatArea.vue';
import ChatColumn from '~/components/chat/ChatColumn.vue';
export default {
    components: { ChatArea, ChatColumn },
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

