import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import App from './App.vue'
import store from './store'

import Api from './service/http';

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(Api);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
