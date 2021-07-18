import Vue from 'vue'
// import ElementUI from 'element-ui';
// import VueForm from "@lljj/vue-json-schema-form";
// import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

import VJsf from '@koumoul/vjsf/lib/VJsf.js'
import '@koumoul/vjsf/lib/VJsf.css'
import '@koumoul/vjsf/lib/deps/third-party.js'

Vue.config.productionTip = false

Vue.component('VJsf', VJsf)

// Vue.component('VueForm', VueForm);
// Vue.use(ElementUI);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
