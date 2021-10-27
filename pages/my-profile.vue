<template>
    <div class="bg_img">
        <el-container>
            <div class="row mt-4" style="max-width:80%;margin:0 auto">
                <div class="col-sm-3">
                    <div class="text-center mb-4">
                        <!-- <b-img id="avatar" :src="myProfile.avatar" rounded="circle" alt="Circle image" style="max-width:250px;border:1px solid black" /> -->
                        <div class="dashboard-widget mb-30  sticky-menu">
                            <div class="user">
                                <div class="thumb-area">
                                    <div class="thumb">
                                        <img :src="avatarUrl" alt="user" style="max-width:100px;max-height:100px;" @error="replaceByDefault">
                                    </div>
                                    <!--<label class="filebutton profile-pic-edit">
                                        <p>Chỉnh sửa</p>
                                        <span><input id="myfile" type="file" @change="handleChangeImage"></span>
                                    </label>-->
                                </div>
                                <div class="content">
                                    <p class="username" />
                                    <span class="email">abc@gmail.com</span>
                                    <p>
                                        {{ mapRoleDisplay() }}
                                    </p>
                                    <p v-if="isAlreadyRq && isBidder">
                                        Bạn đang chờ duyệt lên thành người bán
                                    </p>
                                    <el-button class="custom-button" @click="showChangePassword">
                                        Đổi mật khẩu
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-9">
                    <el-row :gutter="0">
                        <el-col :span="12">
                            <h1 class="title">
                                Thông tin cá nhân
                            </h1>
                        </el-col>
                        <el-col :span="12" class="text-right">
                            <el-button v-if="isBidder" :disabled="isAlreadyRq" @click="handleRequestUpgrade">
                                Yêu cầu được bán
                            </el-button>
                        </el-col>
                    </el-row>
                    <div>
                        <hr>
                        <el-form
                            ref="rulesProfile"
                            :model="myProfile"
                            status-icon
                            :rules="rulesProfile"
                            label-width="120px"
                        >
                            <el-form-item label-width="auto" prop="firstName">
                                <el-input v-model="myProfile.firstName" placeholder="Tên" />
                            </el-form-item>
                            <el-form-item label-width="auto" prop="lastName">
                                <el-input v-model="myProfile.lastName" placeholder="Họ và tên đệm" />
                            </el-form-item>
                            <el-form-item label-width="auto" prop="email">
                                <el-input v-model="myProfile.email" placeholder="Địa chỉ Email" />
                            </el-form-item>
                            <el-form-item label-width="auto" prop="birthday">
                                <el-date-picker
                                    v-model="myProfile.birthday"
                                    type="date"
                                    placeholder="Ngày sinh"
                                    :picker-options="pickerOptions"
                                />
                            </el-form-item>

                            <el-form-item v-if="showAddressInput" label-width="auto" prop="address">
                                <el-input v-model="myProfile.address" placeholder="Địa chỉ" />
                            </el-form-item>
                            <hr>
                            <el-button class="custom-save" @click="handleSave('rulesProfile')">
                                Lưu thay đổi
                            </el-button>
                        </el-form>
                    </div>
                </div>
            </div>
            <el-dialog
                title="Cập nhật mật khẩu"
                :visible.sync="dialogVisible"
                width="30%"
                :show-close="false"
                :close-on-click-modal="false"
                class="text-center"
                :close-on-press-escape="false"
            >
                <el-form
                    ref="passwordForm"
                    :model="passwordForm"
                    status-icon
                    :rules="rules"
                    label-width="120px"
                >
                    <el-form-item label-width="auto" prop="oldPassword">
                        <el-input v-model="passwordForm.oldPassword" placeholder="Mật khẩu cũ" type="password" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label-width="auto" prop="password">
                        <el-input v-model="passwordForm.password" placeholder="Mật khẩu mới" type="password" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label-width="auto" prop="rePassword">
                        <el-input v-model="passwordForm.rePassword" placeholder="Nhập lại mật khẩu mới" type="password" autocomplete="off" />
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
        </el-container>
    </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { authService } from '~/services/auth';
// import { meService } from '~/services/me';

export default {
    middleware: ['authentication'],
    data() {
        const validateOldPass = (_rule:any, value:string, callback:any) => {
            if (value === '')
                callback(new Error('Vui lòng nhập mật khẩu cũ!'));
            callback();
        };
        const validatePass = (_rule:any, value:string, callback:any) => {
            if (value === '')
                callback(new Error('Vui lòng nhập mật khẩu mới!'));
            else {
                const ref = this.$refs.passwordForm as any;
                const that = this as any;
                if (that.passwordForm.rePassword !== '')
                    ref.validateField('rePassword');

                callback();
            }
        };
        const validateRePass = (_rule:any, value:string, callback:any) => {
            if (value === '')
                callback(new Error('Vui lòng nhập lại mật khẩu mới!'));
            else {
                const that = this as any;
                if (that.passwordForm.rePassword !== that.passwordForm.password)
                    callback(new Error('Mật khẩu nhập lại không khớp!'));

                callback();
            }
        };
        return {
            pickerOptions: {
                disabledDate(time:Date) {
                    return time.getTime() > Date.now();
                }
            },
            selectKey: '',
            loadingRemote: false,
            myProfile: {
                firstName: '',
                lastName: '',
                email: '',
                avatar: require('~/assets/images/avatar-default.png'),
                birthday: new Date()
            },
            dialogVisible: false,
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
            rulesProfile: {
                firstName: [
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
                ],
                email: [
                    {
                        required: true,
                        message: 'Vui lòng nhập Email!',
                        trigger: 'blur',
                    },
                    {
                        type: 'email',
                        message: 'Email bị sai định dạng!',
                        trigger: 'blur',
                    }
                ],
                birthday: [
                    {
                        required: true,
                        message: 'Vui lòng nhập sinh nhật!',
                        trigger: 'blur',
                    },
                    {
                        type: 'date',
                        max: new Date(),
                        message: 'Ngày sinh bị sai định dạng!',
                        trigger: 'blur',
                    },
                ]
            },
            avatarUpload: null as File | null,
            isAlreadyRq: false
        };
    },
    computed: {
        ...mapGetters('auth', ['profile', 'roleId']),
        avatarUrl(): string {
            return this.myProfile.avatar ?? '';
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.$nuxt.$loading.start();
            this.myProfile = { ...this.profile };

            this.$nuxt.$loading.finish();
        });
    },
    methods: {
        handleClick() {
            console.log('click');
        },
        remoteMethod(query: string) {
            console.log(query);
        },
        handleChangePage() {
            console.log(this.page);
        },
        showChangePassword() {
            this.dialogVisible = true;
        },
        submitForm(formName: string) {
            this.$refs[formName].validate(async (valid:boolean) => {
                if (valid) {
                    const result = await authService.updatePassword(this.passwordForm.oldPassword, this.passwordForm.password).catch(error => {
                        this.$notify.error({
                            title: 'Error',
                            message: error.message || 'Cannot update password'
                        });
                    });
                    if (result) {
                        this.$notify.success({
                            title: 'Success',
                            message: 'Update password successfully!'
                        });
                    }
                }
            });
        },
        resetForm(formName: string) {
            this.$refs[formName].resetFields();
            this.dialogVisible = false;
        },
        handleChangeImage(e:any) {
            if (e.target.files && e.target.files.length) {
                const file = e.target.files[0];
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL(file);
                const image :any = document.getElementById('avatar');
                if (image)
                    image.src = imageUrl;
                this.avatarUpload = file;
            }
        },
        handleSave(formName: string) {
            this.$nuxt.$loading.start();
            // eslint-disable-next-line require-await
            this.$refs[formName].validate(async (valid:boolean) => {
                if (valid) {
                    if (this.avatarUpload) {
                        const formData = new FormData();
                        formData.append('avatar', this.avatarUpload);
                        // await meService.uploadAvatar(formData).catch((error:any) => {
                        //     this.$notify.error({
                        //         title: 'Error',
                        //         message: error.message || 'Cannot update avatar'
                        //     });
                        // });
                    }

                    // const result = await meService.updateProfile(this.myProfile).catch((error:any) => {
                    //     this.$notify.error({
                    //         title: 'Error',
                    //         message: error.message || 'Cannot update profile'
                    //     });
                    // });
                    // if (result) {
                    //     this.$notify.success({
                    //         title: 'Success',
                    //         message: 'Update profile successfully!'
                    //     });
                    // }
                }
            });
            this.$nuxt.$loading.finish();
        },
        replaceByDefault(e:any) {
            e.target.src = require('~/assets/images/avatar-default.png');
        }
    }
};
</script>
<style lang="scss" scoped>
> ::placeholder {
  color: black;
  opacity: 1; /* Firefox */
}

.dashboard-widget {
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0px 6px 18px 0px rgb(16 5 54 / 17%);
    padding: 30px 20px;
}
.sticky-menu {
    position: sticky;
}

.username{
    color: #37406f;
    font-size: 24px;
    line-height: 28px;
    margin-top: 20px;
    margin-bottom: 0%;
}

.email{
    text-align: center;
    font-family: "Open Sans", sans-serif;
    font-size: 16px;
    color: #52606d;
    line-height: 26px;
}

.thumb-area {
    width: 100px;
    margin: 0 auto 30px;
    position: relative;
}

.dashboard-widget .user .thumb-area .thumb {
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
}
.dashboard-widget .user {
    text-align: center;
    margin-bottom: 30px;
}
.title {
  color: #fff;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 2rem;
}

.bg_img{
      background: -webkit-linear-gradient(
    90deg,
    #5140fe 0%,
    #7757f7 56%,
    #9d6ef0 100%
  );
  height: calc(100vh - 48px);
}

.custom-button {
  height: 50px;
  color: #ffffff;
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  border-radius: 30px;
  font-weight: 500;
  font-size: 13px;
  background: -moz-linear-gradient(90deg, #3da9f5 0%, #683df5 100%);
  background: -ms-linear-gradient(90deg, #3da9f5 0%, #683df5 100%);
  background: -webkit-linear-gradient(90deg, #3da9f5 0%, #683df5 100%);
  box-shadow: -1.04px 4.891px 20px 0px rgb(69 49 183 / 50%);
  font-family: "Roboto", sans-serif;
}

.custom-save{
      height: 50px;
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  border-radius: 30px;
  font-weight: 500;
  font-size: 13px;
background: -webkit-linear-gradient(
92deg, #ff8359 0%, #ffdf40 100%);
  font-family: "Roboto", sans-serif;
}

label.filebutton {
background: -webkit-linear-gradient(
92deg, #ff8359 0%, #ffdf40 100%);
    position: absolute;
    top: 70px;
    right: 0;
    width: 30px;
    height: 30px;
    line-height: 30px;
  background: -moz-linear-gradient(90deg, #3da9f5 0%, #683df5 100%);
  background: -ms-linear-gradient(90deg, #3da9f5 0%, #683df5 100%);
  background: -webkit-linear-gradient(90deg, #3da9f5 0%, #683df5 100%);
  box-shadow: -1.04px 4.891px 20px 0px rgb(69 49 183 / 50%);
    border-radius: 50%;
    color: #ffffff;
}

label span input {
    z-index: 999;
    line-height: 0;
    font-size: 10px;
    position: absolute;
    opacity: 0;
    filter: alpha(opacity = 0);
    -ms-filter: "alpha(opacity=0)";
    cursor: pointer;
    _cursor: hand;
    margin: 0;
    padding:0;
}
</style>
