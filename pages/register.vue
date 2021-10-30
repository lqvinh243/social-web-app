<template>
    <div :style="{ backgroundImage: 'url(' + require('~/assets/images/hero-bg.png') + ')',}" class="bg_img hero-bg">
        <el-container style="max-width:70%;margin:0 auto">
            <b-row class="page-controls" style="padding:5rem 0rem">
                <b-col cols="8" style="background-color:#fff">
                    <div class="section-header" action="#" style="max-width:80%;margin:0 auto;margin-top:10%;">
                        <h1 class="text-center title mb-3">
                            Đăng ký
                        </h1>
                        <p>
                            Vui lòng nhập đầy đủ thông tin dưới đây
                        </p>
                        <el-form ref="ruleForm" :model="registerModel" :rules="rules" label-width="120px" class="demo-ruleForm">
                            <el-form-item label-width="auto" prop="fullname">
                                <el-input v-model="registerModel.fullname" placeholder="Tên" />
                            </el-form-item>
                            <el-form-item label-width="auto" prop="address">
                                <el-input v-model="registerModel.address" placeholder="Địa chỉ" />
                            </el-form-item>
                            <el-form-item label-width="auto" prop="email">
                                <el-input v-model="registerModel.email" placeholder="Địa chỉ Email" />
                            </el-form-item>
                            <el-form-item label-width="auto" prop="Password">
                                <el-input v-model="registerModel.password" type="password" placeholder="Mật khẩu" />
                            </el-form-item>
                            <vue-recaptcha
                                ref="recaptcha"
                                :sitekey="sitekey"
                                @verify="onVerify"
                                @expired="onExpired"
                            />

                            <el-button
                                :disabled="!verifyCapcha"
                                class="custom-button"
                                style="width: 40%;margin-top:1rem; margin-left:10%"
                                type="primary"
                                :loading="loading"
                                @click="handleResiter('ruleForm')"
                            >
                                Đăng ký
                            </el-button>
                        </el-form>
                    </div>
                </b-col>
                <b-col class="right-side">
                    <div style="max-width: 100%">
                        <h1 class="text-center mb-3 title">
                            ĐÃ CÓ TÀI KHOẢN?
                        </h1>
                        <p class="text-center">
                            Đăng nhập ngay!!
                        </p>
                        <nuxt-link to="/login" style="color: #fff" class="custom-login-button transparent">
                            Đăng nhập
                        </nuxt-link>
                    </div>
                </b-col>
            </b-row>
        </el-container>
        <el-dialog
            title="Register successfully"
            :visible.sync="dialogVisible"
            width="30%"
            :show-close="false"
        >
            <div>Register successfully! Login and have fun!</div>
            <nuxt-link to="/login">
                Back to login
            </nuxt-link>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { authService } from '~/services/auth';

export default Vue.extend({
    layout: 'blank',
    middleware: ['non-authentication'],

    data: () => ({
        sitekey: '6LeqPkEcAAAAADQ9itOzqznCafxpgKCqfzFWEJve',
        title: 'Đăng ký',
        email: '',
        password: '',
        loginMessage: '',
        loading: false,
        registerModel: {
            fullname: '',
            email: '',
            password: '',
            address: ''
        },
        rules: {
            fullname: [
                { required: true, message: 'Vui lòng nhập họ tên!', trigger: 'blur' },
                { max: 10, message: 'Tên có độ dài phải nhỏ hơn 10!', trigger: 'blur' },
            ],
            email: [
                { required: true, message: 'Vui lòng nhập email!', trigger: 'blur' },
                { type: 'email', message: 'Định dạng email không hợp lệ!', trigger: 'blur' },

            ],
            password: [
                { required: true, message: 'Vui lòng nhập mật khẩu!', trigger: 'blur' },
            ],
            address: [
                { required: true, message: 'Vui lòng nhập địa chỉ!', trigger: 'blur' },
            ]
        },
        dialogVisible: false,
        verifyCapcha: false

    }),
    head(): object {
        return {
            title: this.title,
            bodyAttrs: {
                class: 'theme-default page-login',
                'data-layout': 'blank',
            },
            script: [
                { once: true, src: 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit', async: 'defer' }
            ],
        };
    },

    methods: {
        handleResiter(formName: string) {
            this.loading = true;
            if (this.verifyCapcha) {
                this.$refs[formName].validate(async (valid:boolean) => {
                    if (valid) {
                        const result = await authService.register(this.registerModel).catch((error:any) => {
                            this.$notify.error({
                                title: 'Error',
                                message: error.message || 'Cannot register!'
                            });
                        });
                        if (result) {
                            this.$refs[formName].resetFields();
                            this.dialogVisible = true;
                        }
                    }
                    this.loading = false;
                });
            }
            else {
                this.loading = false;
                this.$notify.error({
                    title: 'Error',
                    message: 'Please verify capcha!'
                });
            }
        },
        async onVerify(response:any) {
            const result = await authService.verifyCapcha(response).catch(error => {
                this.$refs.recaptcha.reset();
                this.$notify.error({
                    title: 'Error',
                    message: error.message || 'Please verity capcha again!'
                });
            });
            if (result)
                this.verifyCapcha = result;
            else
                this.$refs.recaptcha.reset();
        },
        onExpired() {
            this.verifyCapcha = false;
        }
    }
});
</script>
<style lang="scss" scoped>
>::placeholder {
  color: black;
  opacity: 1; /* Firefox */
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

.right-side .title{
    margin-top: 50%;
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

.custom-login-button {
  margin-left: 25%;
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
</style>

