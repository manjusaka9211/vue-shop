<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="权限管理" title2="角色列表"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 按钮区域 -->
      <el-button type="primary" class="addbtn" @click="addDialogVisible = true">添加角色</el-button>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border style="width: 100%">
        <el-table-column type="expand" label>
          <template slot-scope="scope">
            <el-row v-for="(item1, index1) in scope.row.children" :key="item1.id" :class="['border', index1 === 0 ? 'borderTop' : '', 'center']">
                <!-- 一级权限 -->
                <el-col :span="5"><el-tag closable @close="delright(scope.row, item1.id)">{{item1.authName}}</el-tag><span class="el-icon-caret-right"></span></el-col>
                <!-- 二级和三级权限 -->
                <el-col :span="19">
                    <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :class="[index2 === 0 ? '' : 'borderTop', 'center']">
                        <!-- 二级权限 -->
                        <el-col :span="6"><el-tag type="success" closable @close="delright(scope.row, item2.id)">{{item2.authName}}</el-tag><span class="el-icon-caret-right"></span></el-col>
                        <!-- 三级权限 -->
                        <el-col :span="18">
                            <el-tag closable type="warning"  v-for="item3 in item2.children" :key="item3.id" @close="delright(scope.row, item3.id)">{{item3.authName}}</el-tag>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleterole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showrights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%">
        <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="editForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editrole">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%" @close="addclose">
        <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addrole">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="提示" :visible.sync="rightDialogVisible" width="30%" @close="cleartree">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="rightprops" show-checkbox :default-expand-all="true" node-key="id" :default-checked-keys="defkey" ref="privilegesRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="privileges">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      // 控制修改框的显示与隐藏
      editDialogVisible: false,
      // 控制添加表单的显示与隐藏
      addDialogVisible: false,
      // 控制分配权限对话框的显示与隐藏
      rightDialogVisible: false,
      // 修改表单的数据
      editForm: {},
      // 权限列表
      rightsList: [],
      // 添加表单的数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 树形控件
      rightprops: {
        label: 'authName',
        children: 'children'
      },
      // 控制树形控件默认选中的数组
      defkey: [],
      // 保存当前分配权限的角色的id
      roleId: '',
      // 验证规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    // 获取角色列表
    async getRoles () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('角色列表获取失败')
      this.rolesList = res.data
    },
    // 显示角色修改表单
    showEdit (role) {
      this.editDialogVisible = true
      this.editForm = role
    },
    // 修改角色
    editrole () {
      // 先验证用户输入的内容是否正确
      this.$refs.editFormRef.validate(async valid => {
        // 不正确 阻止代码向下执行
        if (!valid) return false
        // 发送请求
        const { data: res } = await this.$http.put(`roles/${this.editForm.id}`, this.editForm)
        // 判断是否修改成功，不成功则提示用户
        if (res.meta.status !== 200) return this.$message.error('角色修改失败')
        // 隐藏表单
        this.editDialogVisible = false
        // 重新获取数据
        this.getRoles()
      })
    },
    // 删除角色
    deleterole (id) {
      // 询问用户是否确定删除
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确定  发送请求
        const { data: res } = await this.$http.delete(`roles/${id}`)
        // 判断是否删除成功
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        // 重新获取数据
        this.getRoles()
        // 告诉用户删除成功
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        // 取消
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加角色
    addrole () {
      // 先验证用户输入的内容是否正确
      this.$refs.addFormRef.validate(async valid => {
        // 不正确 阻止代码向下执行
        if (!valid) return false
        // 发送请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        // 判断是否添加成功，不成功则提示用户
        if (res.meta.status !== 201) return this.$message.error('角色添加失败')
        // 隐藏表单
        this.addDialogVisible = false
        // 重新获取数据
        this.getRoles()
      })
    },
    // 重置表单 当对话框关闭时重置表单
    addclose () {
      this.$refs.addFormRef.resetFields()
    },
    // 删除指定角色的指定权限
    delright (role, rightid) {
      // 询问用户是否确定删除
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确定  发送请求
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
        // 判断是否删除成功
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        // 重新获取数据
        // this.getRoles()
        role.children = res.data
        // 告诉用户删除成功
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        // 取消
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示分配权限对话框
    async showrights (role) {
      this.roleId = role.id
      // 获取权限列表
      const { data: res } = await this.$http.get('rights/tree')
      // 判断列表是否获取成功
      if (res.meta.status !== 200) return this.$message.error('权限列表获取失败')
      // 讲获取到的数据保存到data中
      this.rightsList = res.data
      // 调用递归函数  获取需要选中的三级权限的id
      this.getkey(role, this.defkey)
      // 显示对话框
      this.rightDialogVisible = true
    },
    // 获取树形控件默认选中的权限id
    getkey (node, arr) {
      // 如果当前节点没有children属性   则表示当前节点是三级权限  将三级权限的id添加到defkey数组中
      if (!node.children) {
        return arr.push(node.id)
      }
      // 当前节点有children属性  不是三级权限  遍历children属性   让每一个对象调用递归函数
      node.children.forEach(item => {
        this.getkey(item, arr)
      })
    },
    // 关闭对话框时  重置树形控件  清空defkey数组
    cleartree () {
      this.defkey = []
    },
    // 分配权限
    async privileges () {
      // 获取当前全选和半选的权限的id
      const keys = this.$refs.privilegesRef.getCheckedKeys().concat(this.$refs.privilegesRef.getHalfCheckedKeys())
      // 将数组转换为,拼接的字符串
      const str = keys.join(',')
      // 发送请求
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: str })
      // 判断是否分配成功
      if (res.meta.status !== 200) return this.$message.error('权限分配失败')
      // 提示用户权限分配成功
      this.$message.success('权限分配成功')
      // 重新渲染页面
      this.getRoles()
      // 隐藏对话框
      this.rightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.addbtn {
  margin-bottom: 20px;
}
.border {
    border-bottom: 1px solid #eee;
}
.el-tag {
    margin: 7px;
}
.borderTop {
    border-top: 1px solid #eee;
}
.center {
    display: flex;
    align-items: center;
}
</style>
