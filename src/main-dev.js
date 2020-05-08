import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 组件按需导入
import './plugins/element.js'
// 全局样式
import './assets/css/global.css'

import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'

import Breadcrumb from './components/breadcrumb.vue'
// 导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的css样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

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
  Nprogress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
// 响应拦截器
axios.interceptors.response.use(config => {
  // 请求成功时隐藏进度条
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
