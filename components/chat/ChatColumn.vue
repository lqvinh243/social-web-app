<template>
    <div class="w-100">
        <v-list dense>
            <v-subheader>List chat</v-subheader>
            <v-list-item-group
                v-model="selectedItem"
                color="primary"
            >
                <v-list-item
                    v-for="(item, i) in conversations"
                    :key="i"
                >
                    <ColumnItem :item="item" />
                </v-list-item>
            </v-list-item-group>
        </v-list>
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
        }
    }
};
</script>

