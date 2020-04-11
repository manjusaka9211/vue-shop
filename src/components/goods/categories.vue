<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="商品管理" title2="商品分类"></breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
        <!-- 添加按钮 -->
        <el-button type="primary" class="addbtn" @click="showaddcate">添加分类</el-button>
        <!-- 表格区域 -->
        <tree-table :data="categoriesList" :columns="columns" show-index tree-type :selection-type="false" :expand-type="false" border>
            <template slot="del" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.cat_deleted" style="color: lightgreen;"></i>
                <i class="el-icon-error" v-if="!scope.cat_deleted" style="color: red;"></i>
            </template>
            <template slot="level" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag size="mini" v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                <el-tag size="mini" v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
            </template>
            <template slot="btn" slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delcate(scope.row)">删除</el-button>
            </template>
        </tree-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryData.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" class="pagebox"></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addClose">
        <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
              <el-cascader v-model="selectKeys" :options="allCate" :props="props" class="selectbox" clearable></el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addcate">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryData: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 保存商品分类数据
      categoriesList: [],
      // 保存总数据条数
      total: 0,
      // 树形表格各列的数据
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'del' },
        { label: '排序', type: 'template', template: 'level' },
        { label: '操作', type: 'template', template: 'btn' }
      ],
      // 控制添加分类对话框的显示与隐藏
      addDialogVisible: false,
      // 全部分类列表
      allCate: [],
      // 添加分类表单数据
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 分类验证规则
      rules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      // 选择器配置
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: 'true'
      },
      // 保存级联选择器选中的数据
      selectKeys: [],
      // 控制修改分类对话框的显示与隐藏
      editDialogVisible: false,
      // 修改分类表单数据
      editForm: []
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    // 获取商品分类数据
    async getCategories () {
      const { data: res } = await this.$http.get('categories', { params: this.queryData })
      // 判断是否获取成功
      if (res.meta.status !== 200) return this.$message.error('商品分类列表获取失败')
      // 将获取到的商品分类保存到data中
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    // 每页显示的数据条数发生改变时
    handleSizeChange (newsize) {
      this.queryData.pagesize = newsize
      this.getCategories()
    },
    // 当前页码改变时
    handleCurrentChange (newpage) {
      this.queryData.pagenum = newpage
      this.getCategories()
    },
    // 添加分类
    showaddcate () {
      this.getCateList()
      this.addDialogVisible = true
    },
    // 获取所有分类列表
    async getCateList () {
      // 发送请求获取全部分类数据
      const { data: res } = await this.$http.get('categories')
      // 保存到data中
      this.allCate = res.data
    },
    async addcate () {
      // 如果selectKeys数组的长度不为0   表示用户选择了父级分类
      if (this.selectKeys.length !== 0) {
        // 父级分类就是selectKeys数组的最后一个元素
        this.addForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 分类的层级就是selectKeys数组的长度
        this.addForm.cat_level = this.selectKeys.length
      }
      // 对表单进行预验证
      this.$refs.addFormRef.validate(async valid => {
        // 如果验证失败  阻止代码向下执行
        if (!valid) return false
        // 发送请求
        const { data: res } = await this.$http.post('categories', this.addForm)
        // 判断请求是否成功
        if (res.meta.status !== 201) return this.$message.error('分类添加失败')
        this.$message.success('分类添加成功')
        // 重新获取数据
        this.getCategories()
        // 隐藏对话框
        this.addDialogVisible = false
      })
    },
    // 添加分类对话框关闭时
    addClose () {
      this.addForm.cat_name = ''
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
      this.selectKeys = []
      this.$refs.addFormRef.resetFields()
    },
    // 显示修改分类对话框
    showEdit (cate) {
      this.editForm = cate
      this.editDialogVisible = true
    },
    // 修改分类
    editCate () {
      // 对表单进行预验证
      this.$refs.editFormRef.validate(async valid => {
        // 如果验证失败  阻止代码向下执行
        if (!valid) return false
        // 发送请求
        const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}`, this.editForm)
        // 判断请求是否成功
        if (res.meta.status !== 200) return this.$message.error('分类修改失败')
        this.$message.success('分类修改成功')
        // 重新获取数据
        this.getCategories()
        // 隐藏对话框
        this.editDialogVisible = false
      })
    },
    // 删除分类
    delcate (cate) {
      // 询问用户是否确定要删除
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确认删除  发送请求
        // 判断当前页还有多少条数据  如果已经删完了  跳转到前一页
        if (this.categoriesList.length === 1 && this.queryData.pagenum !== 1 && cate.cat_level === 0) {
          this.queryData.pagenum--
        }
        const { data: res } = await this.$http.delete(`categories/${cate.cat_id}`)
        if (res.meta.status !== 200) return this.$message.error('分类删除失败')
        // 重新获取数据
        this.getCategories()
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
    }
  }
}
</script>

<style lang="less" scoped>
.addbtn {
    margin-bottom: 20px;
}
.pagebox {
    margin-top: 20px;
}
.selectbox {
    width: 100%;
}
</style>
