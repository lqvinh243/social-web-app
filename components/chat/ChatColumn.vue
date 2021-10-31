<template>
    <div class="w-100">
        <v-list v-if="conversations.length" dense class="chat-column">
            <v-list-item-group
                v-model="selectedItem"
                color="primary"
            >
                <v-list-item
                    v-for="(item, i) in conversations"
                    :key="i"
                    @click="handleSelectChannel(item)"
                >
                    <ColumnItem :item="item" />
                </v-list-item>
            </v-list-item-group>
        </v-list>
        <el-empty v-else description="No channel available" class="chat-column" />
    </div>
</template>

<script lang="ts">
import ColumnItem from '~/components/chat/ColumnItem.vue';
export default {
    components: { ColumnItem },
    middleware: ['authentication'],
    data: () => ({
        selectedItem: -1,
        total: 0,
        conversations: []
    }),
    async  mounted() {
        await this.getConversations();
    },
    methods: {
        async getConversations() {
            const result = await this.$axios.$get('/api/v1/conversations');
            this.total = result.result;
            this.conversations = result.conversations;
        },
        handleSelectChannel(channel: any) {
            this.$emit('channel', channel);
        }
    }
};
</script>
<style scoped>
.chat-column{
    height: 400px;
    overflow: scroll;
}
</style>

