import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登录组件
import Login from '../components/login.vue'
import Home from '../components/home.vue'

Vue.use(VueRouter)

const routes = [
  // 根路径重定向到登录页面
  { path: '/', redirect: '/login' },
  // 登录路由
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = sessionStorage.token
  if (!tokenStr) return next('/login')
  next()
})

export default router
