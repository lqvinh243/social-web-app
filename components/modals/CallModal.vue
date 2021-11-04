<template>
    <el-dialog
        title="Tips"
        :visible.sync="dialogVisible"
        width="50%"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
    >
        <el-row>
            <el-col :span="8">
                <video ref="localStream" style="width:200px" />
            </el-col>
            <el-col :span="16">
                <video ref="remoteStream" style="width:400px" />
            </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
            <el-button @click="handleEndCall">Cancel</el-button>
        </span>
    </el-dialog>
</template>
<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import { connectWS } from '~/utils/socket';
if (typeof navigator !== 'undefined')
    // eslint-disable-next-line no-var
    var { getInstancePeer } = require('~/services/peer');

export default {
    middleware: ['authentication'],
    data() {
        return {
            dialogVisible: false,
            socketCall: null,
            calleId: null,
            peer: null,
            callSuccess: false,
            messageConfirm: null
        };
    },
    computed: {
        ...mapGetters('auth', ['profile', 'userCallId'])
    },
    watch: {
        userCallId: {
            handler(id:string | null) {
                if (id)
                    this.socketCall.emit('start_call', id);
            },
            deep: true
        }
    },
    mounted() {
        this.socketCall = connectWS(this.$config.wsUrl, 'call', this.$store.state.auth.accessToken);
        this.socketCall.on('connect', () => {
            console.log('Socket call is connected!');
        });
        if (process.client) {
            this.socketCall.on('start_call', (data:any) => {
                if (data.code === 'Error') {
                    this.$notify.error({
                        title: 'Error',
                        message: data.msg
                    });
                    this.updateUserCall(null);
                }
                else {
                    this.dialogVisible = true;
                    this.calleId = this.userCallId;
                    this.$nextTick(() => {
                        this.openStream().then((stream:any) => {
                            this.playStream(this.$refs.localStream, stream);
                            const call = this.peer.call(this.userCallId, stream);
                            call.on('stream', (remoteStream:any) => this.playStream(this.$refs.remoteStream, remoteStream));
                        });
                    });
                }
            });

            this.peer = getInstancePeer(this.profile._id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.peer.on('call', (call:any) => {
                this.messageConfirm = this.$confirm('You have new call?. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.calleId = call.peer;
                    this.socketCall.emit('accept_call');
                    this.dialogVisible = true;
                    this.openStream().then((stream:any) => {
                        call.answer(stream);
                        this.playStream(this.$refs.remoteStream, stream);
                        call.on('stream', (remoteStream:any) => this.playStream(this.$refs.localStream, remoteStream));
                    });
                }).catch(() => {
                    this.socketCall.emit('denied_call', (call.peer));
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });
                });
            });
        }

        this.socketCall.on('denied_call', () => {
            this.handleEndCall();
            this.$notify.error({
                title: 'Error',
                message: 'User not accept call!'
            });
        });

        this.socketCall.on('cancel_call', () => {
            this.$message.close();
            this.calleId = null;
            this.$message({
                type: 'info',
                message: 'User end call'
            });
            this.handleEndCall();
        });
    },
    methods: {
        ...mapActions('auth', ['updateUserCall']),
        async openStream() {
            const config = { audio: false, video: true };
            return await navigator.mediaDevices.getUserMedia(config);
        },
        handleEndCall() {
            if (this.calleId)
                this.socketCall.emit('cancel_call', this.calleId);

            this.dialogVisible = false;
            this.updateUserCall(null);
            const stream = this.$refs.localStream.srcObject;
            if (stream) {
                const tracks = stream.getTracks();

                tracks.forEach(function(track:any) {
                    track.stop();
                });

                this.$refs.localStream.srcObject = null;
            }

            const stream1 = this.$refs.remoteStream.srcObject;
            if (stream1) {
                const tracks1 = stream1.getTracks();

                tracks1.forEach(function(track:any) {
                    track.stop();
                });

                this.$refs.remoteStream.srcObject = null;
            }
        },

        playStream(el:any, stream:any) {
            el.srcObject = stream;
            el.play();
        }
    }
};
</script>
