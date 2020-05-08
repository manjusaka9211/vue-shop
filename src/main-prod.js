import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 组件按需导入
// import './plugins/element.js'
// 全局样式
import './assets/css/global.css'

import TreeTable from 'vue-table-with-tree-grid'
import NProgress from 'nprogress'

import Breadcrumb from './components/breadcrumb.vue'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'

Vue.component('breadcrumb', Breadcrumb)

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

// 处理时间格式
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  // 发送请求时显示进度条
  NProgress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
// 响应拦截器
axios.interceptors.response.use(config => {
  // 请求成功时隐藏进度条
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
