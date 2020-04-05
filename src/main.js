import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 组件按需导入
import './plugins/element.js'
// 全局样式
import './assets/css/global.css'

import axios from 'axios'

import Breadcrumb from './components/breadcrumb.vue'
Vue.component('breadcrumb', Breadcrumb)

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
