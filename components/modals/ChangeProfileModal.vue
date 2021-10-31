<template>
    <el-dialog
        title="Change profile"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose"
    >
        <el-form
            ref="rulesProfile"
            :model="myProfile"
            status-icon
            :rules="rulesProfile"
            label-width="120px"
        >
            <el-form-item label-width="auto" prop="firstName">
                <el-input v-model="myProfile.fullname" placeholder="Tên" />
            </el-form-item>

            <el-form-item label-width="auto" prop="address">
                <el-input v-model="myProfile.address" placeholder="Địa chỉ" />
            </el-form-item>
            <el-select v-model="myProfile.gender" placeholder="Select gender">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
            <p>Describe Yourself</p>
            <client-only>
                <ckeditor v-model="myProfile.describeYourself" class="h-25" :config="editorConfig" />
            </client-only>
            <hr>
            <el-button class="custom-save" @click="handleSave('rulesProfile')">
                Lưu thay đổi
            </el-button>
        </el-form>
    </el-dialog>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
    layout: 'default',
    middleware: ['authentication'],
    props: {
        dialogVisible: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }],
            rulesProfile: {
                fullname: [
                    {
                        required: true,
                        message: 'Vui lòng nhập tên!',
                        trigger: 'blur',
                    }
                ],
                address: [
                    {
                        required: true,
                        message: 'Vui lòng nhập địa chỉ!',
                        trigger: 'blur',
                    }
                ]
            },
            myProfile: {
                fullname: '',
                address: '',
                describeYourself: '',
                gender: 'female'
            },
            editorConfig: {
                toolbar: [['Bold']],
                disableObjectResizing: false,
                resize_enabled: false
            },
        };
    },
    computed: {
        ...mapGetters('auth', ['profile'])
    },
    mounted() {
        this.myProfile = { ...this.profile };
    },
    methods: {
        handleClose() {
            this.$emit('closeDialog');
        },

        handleSave(formName: string) {
            this.$nuxt.$loading.start();
            this.$refs[formName].validate(async (valid:boolean) => {
                if (valid) {
                    const result = await this.$axios.$patch('/api/v1/user', this.myProfile);
                    if (result) {
                        this.$notify.success({
                            title: 'Success',
                            message: 'Update profile successfully!'
                        });
                        this.$emit('closeDialog');
                    }
                }
            });
            this.$nuxt.$loading.finish();
        },
    }

});
</script>
