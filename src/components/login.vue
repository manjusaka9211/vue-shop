<template>
  <div class="login_contaiber">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单区域 -->
      <el-form class="login_form" :model="loginForm" :rules="loginRules" ref="loginRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 用户名和密码格式验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {},
  methods: {
    // 重置表单
    resetForm () {
      this.$refs.loginRef.resetFields()
    },
    // 登录功能
    login () {
    // 当用户提交登录时，先验证用户提交的格式是否正确
      this.$refs.loginRef.validate(async valid => {
        // 格式错误，阻止代码向下执行
        if (!valid) return false
        // 向服务器端提交申请，将服务器端返回的数据中的data解构出来
        const { data } = await this.$http.post('login', this.loginForm)
        // 如果服务器端返回的状态码不是200，提示用户登录失败，并阻止代码向下执行
        if (data.meta.status !== 200) return this.$message.error('用户名或密码错误')
        // 提示用户登录成功
        this.$message.success('登录成功')
        // 将服务器端返回的token保存到sessionStorage中，表示已登录
        sessionStorage.setItem('token', data.data.token)
        // 通过编程式导航让页面跳转到home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_contaiber {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #ddd;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
