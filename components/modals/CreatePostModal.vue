<template>
    <el-dialog
        title="Create post"
        :visible.sync="dialogVisiblePost"
        width="40%"
        :before-close="handleClosePost"
    >
        <el-row class="mb-2">
            <el-col :span="3">
                <img
                    :src="displayAvatar"
                    class="big-avatar"
                >
            </el-col>
            <el-col :span="6">
                <p class="mt-2">
                    {{ displayName }}
                </p>
            </el-col>
        </el-row>
        <client-only>
            <ckeditor v-model="content" class="h-25" :config="editorConfig" />
        </client-only>
        <p>Add your post</p>
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
        <el-button class="mx-auto mt-2" :disabled="!fileList.length || !content" @click="handleCreatePost">
            Post
        </el-button>
    </el-dialog>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';

export default {
    props: {
        dialogVisiblePost: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            fileList: [] as any[],
            content: '',
            editorConfig: {
                toolbar: [['Bold']],
                disableObjectResizing: false,
                resize_enabled: false
            },
        };
    },

    computed: {
        ...mapGetters('auth', ['profile']),
        displayName():string {
            return this.profile.fullname;
        },
        displayAvatar(): string {
            return this.profile.avatar;
        }
    },

    async mounted() {
    },

    methods: {
        handleClosePost() {
            this.$emit('closeDialogPost');
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
            if (this.fileList.length === 3) {
                this.$message({
                    message: 'Warning, Only 3 images can be uploaded!',
                    type: 'warning'
                });
                const item = [...this.fileList];
                this.fileList = [...item];
            }
            else
                this.fileList.push({ url: file.url, file });
        },
        async handleCreatePost() {
            this.$nuxt.$loading.start();
            if (!this.content && !this.fileList.length) {
                this.$message({
                    message: 'Warning, Missing content or images!',
                    type: 'warning'
                });
            }
            else {
                const formData = new FormData();
                for (const item of this.fileList)
                    formData.append('files', item.file.raw);

                formData.append('content', this.content);

                const result = await this.$axios.$post('/api/v1/posts', formData);
                if (result) {
                    this.content = '';
                    this.fileList = [];
                    this.$notify.success(
                        {
                            title: 'Success',
                            message: 'Create post successfully!'
                        }
                    );
                }

                this.$emit('closeDialogPost');
            }
            this.$nuxt.$loading.finish();
        }
    }
};
</script>
