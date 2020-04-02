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
  // 后台首页面路由
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 路由守卫 to表示要去的路由地址  from表示来的路由地址
router.beforeEach((to, from, next) => {
  // 如果路由地址是login  放行
  if (to.path === '/login') return next()
  // 获取服务器中sessionStorage中的token
  const tokenStr = sessionStorage.token
  // 如果没有token  代表没有登录 强制跳转到登录页面
  if (!tokenStr) return next('/login')
  // 放行
  next()
})

export default router
