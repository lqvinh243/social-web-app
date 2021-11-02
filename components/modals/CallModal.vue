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
                <video id="localStream" style="width:200px" />
            </el-col>
            <el-col :span="16">
                <video id="remoteStream" style="width:400px" />
            </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
            <el-button @click="handleEndCall">Cancel</el-button>
        </span>
    </el-dialog>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import eventBus from '~/plugins/event-bus';

export default {
    middleware: ['authentication'],
    data() {
        return {
            dialogVisible: false,
            video: null,
            video1: null
        };
    },
    computed: {
        ...mapGetters('auth', ['profile'])
    },
    mounted() {
        eventBus.$on('call_user', () => {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.openStream().then((stream:any) => {
                    this.playStream('localStream', stream);
                });
            });
        });
    },
    methods: {
        async openStream() {
            const config = { audio: true, video: true };
            return await navigator.mediaDevices.getUserMedia(config);
        },
        handleEndCall() {
            this.video.srcObject = null;
            this.dialogVisible = false;
        },

        playStream(idVideo:any, stream:any) {
            this.video = document.getElementById(idVideo) as any;
            this.video.srcObject = stream;
            this.video.play();
        }
    }
};
</script>
