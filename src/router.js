import Vue from 'vue';
import Router from 'vue-router';
import GeneratePage from '@/views/GeneratePage';

Vue.use(Router);

let routeConfig = [{
    path: '/GeneratePage',
    name: 'add new page',
    component: GeneratePage,
}];

export default new Router({
    mode: 'hash',
    routes: routeConfig,
    base: process.env.BASE_URL,
});