import Vue from 'vue';
import * as VeeValidate from 'vee-validate';

const config = {
    errorBagName: 'abc', // change if property conflicts.
    fieldsBagName: 'abc',
    inject: false
};
Vue.use(VeeValidate, config);
