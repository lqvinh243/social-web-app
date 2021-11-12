<template>
    <div v-if="isMyMessage" class="chat_row you_message">
        <div class="chat_title">
            <span>You</span>
        </div>
        <div class="you_content">
            <div class="chat_text" style="filter: invert(0)">
                {{ item.text || '...' }}
            </div>
        </div>
        <span class="time-left" style="font-size:10px">{{ displayTime }}</span>
        <p v-if="isSend === false" style="font-size:10px;color:red">
            Message cannot send
        </p>
    </div>

    <div v-else class="chat_row other_message">
        <div class="chat_title">
            <span>{{ displayNameRecipient }}</span>
        </div>
        <div class="you_content">
            <div class="chat_text" style="filter: invert(0)">
                {{ item.text || '...' }}
            </div>
        </div>
        <span class="time-right" style="font-size:10px">{{ displayTime }}</span>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default Vue.extend({
    layout: 'default',
    middleware: ['authentication'],
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        recipient: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            isSend: true
        };
    },
    computed: {
        ...mapGetters('auth', ['profile']),
        isMyMessage():boolean {
            return this.profile._id === this.item.sender;
        },
        displayTime():string {
            return moment(this.item.createdAt).fromNow();
        },
        displayNameRecipient(): string {
            return this.recipient.user.fullname;
        }
    },
    watch: {
        item: {
            handler(val) {
                this.isSend = val.isSend;
            },
            deep: true
        }
    },
});
</script>
