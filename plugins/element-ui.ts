import Vue from 'vue';
import ElementUI from 'element-ui';
const locale = require('element-ui/lib/locale/lang/vi');

export default () => {
    Vue.use(ElementUI, { locale: locale.default });
};
