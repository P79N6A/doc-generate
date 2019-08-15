// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ESUI from '@360es/esui-components';
import '@360es/esui-components/lib/theme-default/index.css'
import 'normalize.css';
import '@fortawesome/fontawesome-free/css/all.css'
import './assets/css/custome-style.css'
import DocHeader from './components/Header.vue';
import DocSection from './components/Section.vue';
import DocContent from './components/Content.vue';
import axios from 'axios';


Vue.config.productionTip = false;


Vue.use(ESUI);
Vue.prototype.$http = axios;

Vue.component('DocSection', DocSection);
Vue.component('DocHeader', DocHeader);
Vue.component('DocContent', DocContent);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')