<template>
    <div v-if="channel" class="w-100">
        <el-button @click="handleCall">
            Call
        </el-button>
        <div ref="containerMessage" class="chat-area" @scroll="infiniteScroll">
            <ChatAreaItem v-for="item in messages" :key="item._id" :item="item" :recipient="recipientInfo" />
        </div>
        <div>
            <el-row class="w-100 h-100" :gutter="8">
                <el-col :span="17">
                    <el-input v-model="input" :disabled="!channel" placeholder="Enter message ..." />
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" :disabled="!input.length" icon="el-icon-s-promotion" @click="handleSendMessage">
                        Send message
                    </el-button>
                </el-col>
            </el-row>
        </div>
    </div>
    <div v-else class="chat-area">
        <el-empty description="Select channel to chat!!" />
    </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import ChatAreaItem from '~/components/chat/ChatAreaItem.vue';
import eventBus from '~/plugins/event-bus';
import { connectWS } from '~/utils/socket';
export default {
    components: { ChatAreaItem },
    middleware: ['authentication'],
    props: {
        channel: {
            type: Object,
            default: () => null
        },
    },
    data: () => ({
        input: '',
        messages: [],
        total: 0,
        scrollTop: 0,
        page: 1,
        channelId: null,
        isScrollLoad: false,
        scrollHeight: 0,
        sender: null,
        recipient: null,
        recipientInfo: null
    }),

    computed: {
        ...mapGetters('auth', ['profile'])
    },

    watch: {
        channel: {
            async handler(val:any) {
                this.$nuxt.$loading.start();
                this.messages = [];
                this.page = 1;
                this.channelId = val._id;
                this.isScrollLoad = true;

                if (this.channel.recipients[0]._id === this.profile._id) {
                    this.sender = val.recipients[0]._id;
                    this.recipient = val.recipients[1]._id;
                }
                else {
                    this.sender = val.recipients[1]._id;
                    this.recipient = val.recipients[0]._id;
                }
                await this.getUser(this.recipient);
                await this.loadMessage(this.channelId);
                this.scrollBottom();
            },
            deep: true
        }
    },

    mounted() {
        const socket = connectWS(this.$config.wsUrl, 'chat', this.$store.state.auth.accessToken);

        socket.on('connect', () => {
            // eslint-disable-next-line no-console
            console.log('Chat channel is connected!');
        });

        socket.on('disconnect', () => {
            // eslint-disable-next-line no-console
            console.log('Chat channel is disconnected!');
        });

        socket.on('connect_error', (err: Error) => {
            // eslint-disable-next-line no-console
            console.log('connect_error', err);
        });

        socket.on('new_message', (data:any) => {
            let isScroll = false;
            const el = this.$refs.containerMessage;
            if (this.scrollTop === el.scrollTop)
                isScroll = true;

            this.messages.push(data);
            this.$nextTick(() => {
                if (isScroll)
                    this.scrollBottom();
            }
            );
        });
    },

    methods: {
        ...mapActions('auth', ['updateUserCall']),
        scrollBottom() {
            this.$nextTick(() => {
                const el = this.$refs.containerMessage;
                el.scrollTop = el.scrollHeight;
                this.scrollTop = el.scrollTop;
            });
        },
        async loadMessage(channelId: string) {
            const el = this.$refs.containerMessage;
            this.scrollHeight = el.scrollHeight;
            this.$nuxt.$loading.start();

            const result = await this.$axios.$get(`/api/v1/message/${channelId}?page=${this.page}`);
            this.total = result.result;
            if (this.messages.length === 0)
                this.messages = this.messages.concat(result.messages.reverse());
            else {
                this.messages = result.messages.reverse().concat(this.messages);

                this.$nextTick(() => {
                    el.scrollTop = el.scrollHeight - this.scrollHeight;
                });
            }

            if (this.total < 9)
                this.isScrollLoad = true;
            else
                this.isScrollLoad = false;

            this.$nuxt.$loading.finish();
        },

        async handleSendMessage() {
            const body = {
                text: this.input,
                sender: this.sender,
                recipient: this.recipient,
                isSend: true
            };
            this.input = '';
            const index = this.messages.length;
            this.messages.push(body);
            this.scrollBottom();

            const result = await this.$axios.$post('/api/v1/message', body);
            if (result.msg !== 'Create Success!')
                this.messages[index].isSend = false;
        },

        async getUser(id: string) {
            const user = await this.$axios.$get(`/api/v1/user/${id}`);
            this.recipientInfo = user;
        },

        async infiniteScroll() {
            const el = this.$refs.containerMessage;
            if (el.scrollTop === 0 && this.isScrollLoad === false) {
                this.page++;
                console.log('scroll');

                await this.loadMessage(this.channelId);
            }
        },

        handleCall() {
            eventBus.$emit('call_user', this.recipient);
            this.updateUserCall(this.recipient);
        }
    }
};
</script>
<style scoped>
body{
    background: #ccc;
}
.container {
  border: 2px solid #dedede;
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

/* Darker chat container */
.darker {
  border-color: #ccc;
  background-color: #ddd;
}

/* Clear floats */
.container::after {
  content: "";
  clear: both;
  display: table;
}

/* Style images */
.container img {
  float: left;
  max-width: 60px;
  width: 100%;
  margin-right: 20px;
  border-radius: 50%;
}

/* Style the right image */
.container img.right {
  float: right;
  margin-left: 20px;
  margin-right:0;
}

/* Style time text */
.time-right {
  float: right;
  color: #aaa;
}

/* Style time text */
.time-left {
  float: left;
  color: #999;
}

.chat-area{
    height: 400px;
    overflow: scroll;
}
i:hover{
    cursor: pointer;
}
</style>

