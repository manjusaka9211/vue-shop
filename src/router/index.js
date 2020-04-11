import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入组件
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Categories from '../components/goods/categories.vue'
import Params from '../components/goods/params.vue'
import Goods from '../components/goods/goods.vue'
import Addgoods from '../components/goods/add.vue'
import Order from '../components/orders/order.vue'

Vue.use(VueRouter)

const routes = [
  // 根路径重定向到登录页面
  { path: '/', redirect: '/login' },
  // 登录路由
  { path: '/login', component: Login },
  // 后台首页面路由
  {
    path: '/home',
    component: Home,
    children: [
      { path: '/home', redirect: '/welcome' },
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/addgoods', component: Addgoods },
      { path: '/orders', component: Order }
    ]
  }
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
