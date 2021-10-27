/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import Vue from 'vue';
import VueCarousel, { Slide } from 'vue-carousel';
// import { Carousel, Slide } from 'vue-carousel';

export default () => {
    Vue.component('Slide', Slide);
    Vue.use(VueCarousel);
};
