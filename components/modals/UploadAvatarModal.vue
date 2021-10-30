<template>
    <el-dialog
        title="Upload avatar"
        :visible.sync="dialogVisibleAvatar"
        width="40%"
        :before-close="handleCloseAvatar"
    >
        <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
        >
            <i slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{file}">
                <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                >
                <span class="el-upload-list__item-actions">
                    <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                    >
                        <i class="el-icon-zoom-in" />
                    </span>
                    <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                    >
                        <i class="el-icon-download" />
                    </span>
                    <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                    >
                        <i class="el-icon-delete" />
                    </span>
                </span>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button class="mx-auto mt-2" :disabled="!fileList.length" @click="handleChangeAvatar">
            Submit change
        </el-button>
    </el-dialog>
</template>

<script lang="ts">
import { mapActions } from 'vuex';

export default {
    props: {
        dialogVisibleAvatar: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            fileList: [] as any[]
        };
    },
    methods: {
        ...mapActions('auth', ['updateAvatar']),
        handleCloseAvatar() {
            this.$emit('closeDialogAvatar');
        },
        handleRemove(file:any) {
            this.fileList = this.fileList.filter((item:any) => item.url !== file.url);
        },
        handlePictureCardPreview(file:any) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleDownload(file:any) {
            console.log(file);
        },
        handleChange(file:any) {
            this.fileList = [];
            this.fileList.push({ url: file.url, file });
        },
        async handleChangeAvatar() {
            this.$nuxt.$loading.start();
            const formData = new FormData();
            formData.append('file', this.fileList[0].file.raw);
            const result = await this.$axios.$patch('/api/v1/user/avatar', formData);
            if (result)
                this.updateAvatar(result.avatar);

            this.$emit('closeDialogAvatar', result.avatar);
            this.$nuxt.$loading.finish();
        }
    }
};
</script>
