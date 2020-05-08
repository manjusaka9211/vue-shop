<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 主体部分 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级导航 -->
          <el-submenu :index="item.id + ''" v-for="item in menusList" :key="item.id">
            <!-- 一级导航模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级导航 -->
            <el-menu-item :index="'/' + ele.path" v-for="ele in item.children" :key="ele.id" @click="path('/' + ele.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ele.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menusList: [],
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-star-on',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-grid',
        145: 'el-icon-s-marketing'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenusList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出登录
    logout () {
      // 清空sessionStorage中的token
      sessionStorage.clear()
      // 通过编程式导航跳转到登录页面
      this.$router.push('/login')
    },
    async getMenusList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return false
      this.menusList = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    path (path) {
      sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
