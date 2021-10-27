<template>
    <div :style="{backgroundImage: 'url(' + require('~/assets/images/hero-bg.png') + ')',}" class="bg_img hero-bg">
        <el-container style="max-width: 70%; margin: 0 auto">
            <b-row class="page-controls" style="padding: 5rem 0rem">
                <b-col h-100 cols="8" style="background-color: #fff">
                    <div style="max-width: 80%">
                        <div class="section-header">
                            <h1 class="text-center mb-3 title" style="margin-top:10%">
                                Xin chào
                            </h1>
                            <p>Vui lòng nhập đầy đủ thông tin để đổi mật khẩu!</p>
                        </div>
                        <el-form
                            :ref="formName"
                            :model="resetPasswordModel"
                            :rules="rules"
                            label-width="120px"
                            class="demo-ruleForm text-box"
                        >
                            <el-form-item label-width="auto" prop="password">
                                <el-input
                                    v-model="resetPasswordModel.password"
                                    placeholder="Nhập mật khẩu mới"
                                    type="password"
                                />
                            </el-form-item>

                            <el-form-item label-width="auto" prop="rePassword">
                                <el-input
                                    v-model="resetPasswordModel.rePassword"
                                    placeholder="Nhập lại mật khẩu mới"
                                    type="password"
                                />
                            </el-form-item>

                            <el-button
                                class="custom-button mb-3"
                                style="width: 40%; margin-top: 1rem"
                                type="primary"
                                :loading="loading"
                                @click="resetPassword(formName)"
                            >
                                Đổi mật khẩu
                            </el-button>
                        </el-form>
                    </div>
                </b-col>
            </b-row>
        </el-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { authService } from '~/services/auth';

export default Vue.extend({
    layout: 'blank',
    middleware: ['non-authentication'],
    data() {
        const validatePass = (_rule:any, value:string, callback:any) => {
            if (value === '')
                callback(new Error('Vui lòng nhập mật khẩu!'));
            else {
                const ref = this.$refs.resetPasswordForm as any;
                const that = this as any;
                if (that.resetPasswordModel.rePassword !== '')
                    ref.validateField('rePassword');

                callback();
            }
        };
        const validateRePass = (_rule:any, value:string, callback:any) => {
            if (value === '')
                callback(new Error('Vui lòng nhập lại mật khẩu!'));
            else {
                const that = this as any;
                if (that.resetPasswordModel.rePassword !== that.resetPasswordModel.password)
                    callback(new Error('Mật khẩu nhập lại không khớp!'));

                callback();
            }
        };
        return {
            formName: 'resetPasswordForm',
            title: 'Đổi mật khẩu',
            loading: false,
            resetPasswordModel: {
                password: '',
                rePassword: ''
            },
            email: '',
            forgotKey: '',
            rules: {
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                rePassword: [
                    { validator: validateRePass, trigger: 'blur' }
                ]
            },
        };
    },
    head(): object {
        return {
            title: this.title,
            bodyAttrs: {
                class: 'theme-default page-login',
                'data-layout': 'blank',
            },
        };
    },
    mounted() {
        this.email = this.$route.query.email;
        this.forgotKey = this.$route.query.forgotKey;
        if (!this.email || !this.forgotKey)
            this.$router.push('/');
    },
    methods: {
        resetPassword(formName: string) {
            this.loading = true;
            this.$refs[formName].validate(async (valid: boolean) => {
                if (valid) {
                    const result = await authService.resetPassword({ email: this.email, forgotKey: this.forgotKey, password: this.resetPasswordModel.password }).catch(_ => {
                        this.$notify.error({
                            title: 'Lỗi',
                            message: 'Không thể đổi mật khẩu cho tài khoản này!'
                        });
                    });
                    if (result && result.data) {
                        this.$notify.success({
                            title: 'Thành công',
                            message: 'Đổi mật khẩu thành công!'
                        });
                        this.$router.push('/login');
                    }
                }
                this.loading = false;
            });
        },
    },
});
</script>
<style lang="scss" scoped>
> ::placeholder {
  color: black;
  opacity: 1; /* Firefox */
}

.section-header {
  margin-bottom: 55px;
  margin: 0 auto 35px;
  text-align: center;
}

.section-header h1 {
  color: #171d1c;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 2rem;
}
.custom-button {
  margin-left: 30%;
  font-size: 16px;
  height: 50px;
  color: #ffffff;
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  border-radius: 30px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 18px;
  background: -moz-linear-gradient(90deg, #3da9f5 0%, #683df5 100%);
  background: -ms-linear-gradient(90deg, #3da9f5 0%, #683df5 100%);
  background: -webkit-linear-gradient(90deg, #3da9f5 0%, #683df5 100%);
  box-shadow: -1.04px 4.891px 20px 0px rgb(69 49 183 / 50%);
  font-family: "Roboto", sans-serif;
}
.right-side {
  background: -webkit-linear-gradient(
    90deg,
    #5140fe 0%,
    #7757f7 56%,
    #9d6ef0 100%
  );
  color: #ffffff;
}

.right-side h1 {
  color: #ffffff;
}

.bg_img {
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-position: bottom center;
}
.hero-bg {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
}
.text-box {
  margin-left: 10%;
}

.right-side .title{
    margin-top: 40%;
    text-transform: capitalize;
    font-family: "Roboto", sans-serif;
    font-size: 1.75rem;
}

.transparent {
    background: transparent !important;
    border-radius: 30px;
    padding: 12px 30px 10px;
    font-size: 18px;
}
</style>
