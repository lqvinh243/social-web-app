<template>
    <el-container class="h-100 w-75 mx-auto mt-4">
        <el-row :gutter="20" class="w-100 h-100">
            <el-col :span="8">
                <chat-column />
            </el-col>
            <el-col :span="12">
                <chat-area />
            </el-col>
        </el-row>
    </el-container>
</template>

<script lang="ts">
import ChatArea from '~/components/chat/ChatArea.vue';
import ChatColumn from '~/components/chat/ChatColumn.vue';
export default {
    components: { ChatArea, ChatColumn },
    middleware: ['authentication'],
};
</script>

