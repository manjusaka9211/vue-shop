<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="商品管理" title2="分类参数"></breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
        <!-- 提示内容 -->
        <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false" class="warnAlert"></el-alert>
        <el-row>
            <!-- 级联选择器 -->
            <span>选择商品分类：</span>
            <el-cascader v-model="selectKeys" :options="cateList" :props="props" @change="handleChange"></el-cascader>
            <!-- 动态参数部分 -->
            <el-tabs v-model="activeName">
                <el-tab-pane label="动态参数" name="first">
                    <!-- 添加参数按钮 -->
                    <el-button type="primary" size="small" :disabled="selectKeys.length !== 3" @click="showAddForm('many')">添加参数</el-button>
                    <!-- 表格部分 -->
                    <el-table :data="manyAttrList" border style="width: 100%" class="attrTab">
                      <!-- 表格展开行 -->
                        <el-table-column type="expand">
                          <template slot-scope="scope">
                            <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="delVal(index,scope.row)">{{item}}</el-tag>
                            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                          </template>
                        </el-table-column>
                        <!-- 序号行 -->
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <!-- 操作按钮区域 -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditForm(scope.row)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 静态属性部分 -->
                <el-tab-pane label="静态属性" name="second">
                    <!-- 添加属性按钮 -->
                    <el-button type="primary" size="small" :disabled="selectKeys.length !== 3" @click="showAddForm('only')">添加属性</el-button>
                    <!-- 表格部分 -->
                    <el-table :data="onlyAttrList" border style="width: 100%" class="attrTab">
                        <!-- 表格展开行 -->
                        <el-table-column type="expand">
                          <template slot-scope="scope">
                            <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="delVal(index,scope.row)">{{item}}</el-tag>
                            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                          </template>
                        </el-table-column>
                        <!-- 序号行 -->
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                        <!-- 操作按钮部分 -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditForm(scope.row)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + addtitle" :visible.sync="addDialogVisible" width="30%">
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="100px">
        <el-form-item :label="addtitle + '名称'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改' + edittitle" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item :label="edittitle + '名称'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分类数据列表
      cateList: [],
      // 级联选择器配置对象
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选中数据
      selectKeys: [],
      // 控制标签页的显示
      activeName: 'first',
      // 动态参数数据列表
      manyAttrList: [],
      // 静态属性列表
      onlyAttrList: [],
      // 控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      // 添加表单
      addForm: {
        attr_name: '',
        attr_sel: ''
      },
      // 分类验证规则
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 要添加的是参数还是属性
      addtitle: '',
      edittitle: '',
      // 修改参数表单
      editForm: {},
      // 控制修改参数对话框的显示与隐藏
      editDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('分类列表获取失败')
      this.cateList = res.data
    },
    // 级联选择器发生改变
    handleChange () {
      // 判断用户选择的是几级分类
      if (this.selectKeys.length !== 3) {
        // 如果用户选择的不是三级分类  清空用户选择的内容
        this.selectKeys = []
        this.manyAttrList = []
        this.onlyAttrList = []
      } else {
        this.getParams()
      }
    },
    async getParams () {
      // 如果用户选择的是三级分类  获取参数列表
      const id = this.selectKeys[2]
      // 静态参数
      const { data: onlyres } = await this.$http.get(`categories/${id}/attributes`, { params: { sel: 'only' } })
      if (onlyres.meta.status !== 200) return this.$message.error('参数获取失败')
      // 遍历数据   将attr_vals属性的值转换为数组
      onlyres.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      this.onlyAttrList = onlyres.data
      // 动态参数
      const { data: manyres } = await this.$http.get(`categories/${id}/attributes`, { params: { sel: 'many' } })
      if (manyres.meta.status !== 200) return this.$message.error('参数获取失败')
      // 遍历数据   将attr_vals属性的值转换为数组
      manyres.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      this.manyAttrList = manyres.data
    },
    // 显示添加参数对话框
    showAddForm (params) {
      if (params === 'only') {
        this.addtitle = '属性'
        this.addForm.attr_sel = 'only'
      } else {
        this.addtitle = '参数'
        this.addForm.attr_sel = 'many'
      }
      this.addDialogVisible = true
    },
    // 重置添加表单
    addClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加属性
    addParams () {
      // 预验证表单
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        // 获取需要添加的分类的id
        const id = this.selectKeys[2]
        // 发送请求
        const { data: res } = await this.$http.post(`categories/${id}/attributes`, this.addForm)
        // 判断请求是否成功
        if (res.meta.status !== 201) return this.$message.error('参数添加失败')
        this.$message.success('参数添加成功')
        // 重新获取属性
        this.getParams()
        // 隐藏对话框
        this.addDialogVisible = false
      })
    },
    // 显示修改属性对话框
    showEditForm (params) {
      this.editForm = params
      if (params.attr_sel === 'only') {
        this.edittitle = '属性'
      } else {
        this.edittitle = '参数'
      }
      this.editDialogVisible = true
    },
    // 提交修改
    editParams () {
      // 预验证表单
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 获取需要添加的分类的id
        const id = this.selectKeys[2]
        console.log(this.editForm)
        // 发送请求
        const { data: res } = await this.$http.put(`categories/${id}/attributes/${this.editForm.attr_id}`, this.editForm)
        console.log(res)
        // 判断请求是否成功
        if (res.meta.status !== 200) return this.$message.error('参数修改失败')
        this.$message.success('参数修改成功')
        // 重新获取属性
        this.getParams()
        // 隐藏对话框
        this.editDialogVisible = false
      })
    },
    // 删除属性
    delParams (attrId) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const id = this.selectKeys[2]
        const { data: res } = await this.$http.delete(`categories/${id}/attributes/${attrId}`)
        // 判断请求是否成功
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        // 重新获取属性
        this.getParams()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示添加属性内容的输入框
    showInput (row) {
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 输入框失去焦点或按下回车键触发
    async handleInputConfirm (row) {
      const inputValue = row.inputValue
      // 判断输入框中是否有内容
      if (inputValue) {
        // 输入了内容  将用户输入的内容添加到数组中
        row.attr_vals.push(inputValue)
        this.saveVals(row)
      }
      // 清空并隐藏输入框
      row.inputVisible = false
      row.inputValue = ''
    },
    // 删除属性内容
    delVal (index, row) {
      row.attr_vals.splice(index, 1)
      this.saveVals(row)
    },
    async saveVals (row) {
      // 发送请求
      await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.warnAlert {
    margin-bottom: 20px;
}
.attrTab {
    margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.input-new-tag {
  width: 120px;
}
</style>
