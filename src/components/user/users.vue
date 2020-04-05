<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="用户管理" title2="用户列表"></breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索框和添加用户按钮 -->
      <el-row :gutter="20" class="top">
        <!-- 搜索框 -->
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryData.query"
            clearable
            @clear="getUsers"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表部分 -->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changestate(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteuser(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能部分 -->
      <!-- size-change每页显示的数据条数发生改变触发 -->
      <!-- current-change当前页码发生改变触发 -->
      <!-- current-page当前页数 -->
      <!-- page-size当前每页显示的数据条数 -->
      <!-- layout需要展示的功能 -->
      <!-- total总数据条数 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="page"
      ></el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="addclose">
      <el-form
        :model="addForm"
        :rules="formRules"
        ref="addFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="30%">
      <el-form
        :model="editForm"
        :rules="formRules"
        ref="editFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义邮箱验证规则
    var emailchack = (rule, value, callback) => {
      // 邮箱验证正则
      var emailreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+([a-zA-Z0-9_-])+/
      // 格式正确
      if (emailreg.test(value)) return callback()
      // 格式不正确  提示错误信息
      callback(new Error('请输入正确的邮箱'))
    }
    // 自定义电话验证规则
    var mobilechack = (rule, value, callback) => {
      // 电话验证正则
      var mobilereg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      // 格式正确
      if (mobilereg.test(value)) return callback()
      // 格式不正确  提示错误信息
      callback(new Error('请输入正确的手机号'))
    }
    return {
      // 获取用户信息的数据
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 保存用户信息
      userList: [],
      // 总数据条数
      total: 0,
      // 控制添加用户对话框显示与隐藏
      dialogVisible: false,
      // 控制修改用户对话框显示与隐藏
      editdialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      // 添加用户的验证规则
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailchack, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: mobilechack, trigger: 'blur' }
        ]
      }
    }
  },
  // 页面加载获取用户列表
  created () {
    this.getUsers()
  },
  methods: {
    // 获取用户列表
    async getUsers () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryData
      })
      // 判断状态码如果不等于200 提示用户获取失败
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      // 保存获取到的用户列表
      this.userList = res.data.users
      // 保存数据总条数
      this.total = res.data.total
    },
    // 每页显示的数据条数发生改变
    handleSizeChange (newsize) {
      this.queryData.pagesize = newsize
      this.getUsers()
    },
    // 当前页码发生改变
    handleCurrentChange (newpage) {
      this.queryData.pagenum = newpage
      this.getUsers()
    },
    // 用户状态发生改变
    async changestate (userinfo) {
      // 发送请求修改数据
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      // 判断状态码是否为200 如果不是 重置开关并提示用户状态修改失败
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('用户状态修改失败')
      }
    },
    // 重置表单 当对话框关闭时重置表单
    addclose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    async addUser () {
      // 先验证用户输入的内容是否正确
      this.$refs.addFormRef.validate(async valid => {
        // 不正确 阻止代码向下执行
        if (!valid) return false
        // 发送请求
        const { data: res } = await this.$http.post('users', this.addForm)
        // 如果状态码不为201 提示用户添加失败 并阻止代码向下执行
        if (res.meta.status !== 201) return this.$message.error('用户添加失败')
        // 关闭对话框
        this.dialogVisible = false
        // 重新获取数据
        this.getUsers()
      })
    },
    // 显示用户修改的表单和数据
    showEdit (user) {
      this.editdialogVisible = true
      this.editForm = user
    },
    // 修改用户
    edituser () {
      // 先验证用户输入的内容是否正确
      this.$refs.editFormRef.validate(async valid => {
        // 不正确 阻止代码向下执行
        if (!valid) return false
        // 发送请求
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        )
        // 判断返回的状态码是否为200
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        // 关闭对话框
        this.editdialogVisible = false
        // 重新获取数据
        this.getUsers()
      })
    },
    // 删除用户
    deleteuser (userid) {
      // 弹出确认框提示用户是否确定删除
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 用户点击确定
          // 发送请求
          const { data: res } = await this.$http.delete(`users/${userid}`)
          // 判断是否删除成功  不成功则提示用户删除失败并阻止代码向下执行
          if (res.meta.status !== 200) return this.$message.error('删除失败')
          // 提示用户删除成功
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 判断当前页用户列表长度 如果当前页的数据删除完了并且当前不是第一页就自动跳转到前一页
          if (this.userList.length === 1 && this.queryData.pagenum !== 1) {
            this.queryData.pagenum--
          }
          this.getUsers()
        })
        // 用户点击取消
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  margin-bottom: 20px;
}
.page {
  margin-top: 20px;
}
</style>
