<template>
  <div>
      <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    // 退出登录
    logout () {
      // 清空sessionStorage中的token
      sessionStorage.clear()
      // 通过编程式导航跳转到登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
