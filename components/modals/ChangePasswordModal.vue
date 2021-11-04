<template>
    <el-dialog
        title="Cập nhật mật khẩu"
        :visible.sync="visiableChangePassword"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
        class="text-center"
        :close-on-press-escape="false"
        :destroy-on-close="false"
    >
        <el-form
            ref="passwordForm"
            :model="passwordForm"
            status-icon
            :rules="rules"
            label-width="120px"
        >
            <el-form-item label-width="auto" prop="oldPassword">
                <el-input v-model="passwordForm.oldPassword" placeholder="Current password" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label-width="auto" prop="password">
                <el-input v-model="passwordForm.password" placeholder="New password" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label-width="auto" prop="rePassword">
                <el-input v-model="passwordForm.rePassword" placeholder="Re-new password" type="password" autocomplete="off" />
            </el-form-item>

            <el-form-item>
                <el-button @click="resetForm('passwordForm')">
                    Hủy bỏ
                </el-button>
                <el-button type="success" @click="submitForm('passwordForm')">
                    Lưu
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script lang="ts">
import { mapActions, mapGetters } from 'vuex';

export default {
    middleware: ['authentication'],
    data() {
        const validateOldPass = (_rule:any, value:string, callback:any) => {
            if (value === '')
                callback(new Error('Please input current password!'));
            if (value.length < 6)
                callback(new Error('Length must be greater than 6!'));

            callback();
        };
        const validatePass = (_rule:any, value:string, callback:any) => {
            if (value === '')
                callback(new Error('Please input new password!'));
            else {
                const ref = this.$refs.passwordForm as any;
                const that = this as any;
                if (value.length < 6)
                    callback(new Error('Length must be greater than 6!'));
                if (that.passwordForm.rePassword !== '')
                    ref.validateField('rePassword');

                callback();
            }
        };
        const validateRePass = (_rule:any, value:string, callback:any) => {
            if (value === '')
                callback(new Error('Please input re-new password!'));
            else if (value.length < 6)
                callback(new Error('Length must be greater than 6!'));
            else {
                const that = this as any;
                if (that.passwordForm.rePassword !== that.passwordForm.password)
                    callback(new Error('New password and re-new password is not same!'));

                callback();
            }
        };
        return {
            passwordForm: {
                oldPassword: '',
                password: '',
                rePassword: ''
            },
            rules: {
                oldPassword: [
                    { validator: validateOldPass, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                rePassword: [
                    { validator: validateRePass, trigger: 'blur' }
                ]
            },
        };
    },
    computed: {
        ...mapGetters('auth', ['visiableChangePassword'])
    },
    mounted() {
    },
    destroyed() {

    },
    methods: {
        ...mapActions('auth', ['updateVisibleChangePassword']),
        resetForm(formName: string) {
            this.$refs[formName].resetFields();
            this.updateVisibleChangePassword(false);
        },
        submitForm(formName: string) {
            this.$refs[formName].validate(async (valid:boolean) => {
                if (valid) {
                    const result = await this.$axios.$post('/api/v1/auths/resetpassword', { oldPass: this.passwordForm.oldPassword, newPass: this.passwordForm.password })
                        .catch((_:any) => {
                            this.$notify.error({
                                title: 'Error',
                                message: 'Some error, please try again'
                            });
                        });
                    if (result) {
                        this.$notify.success({
                            title: 'Success',
                            message: 'Change password successfully!'
                        });
                        this.dialogVisible = false;
                    }
                }
            });
        },
    }
};
</script>
