<template>
  <div>
      <!-- 面包屑导航 -->
    <breadcrumb title1="商品管理" title2="添加商品"></breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
        <!-- 提示信息 -->
        <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
        <!-- 步骤条 -->
        <el-steps :space="250" :active="+activeIndex" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <!-- tab栏 -->
        <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="100px" class="demo-ruleForm" label-position="top">
            <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClick">
              <!-- 基本信息区域 -->
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="addForm.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="addForm.goods_weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model="addForm.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_cat">
                  <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="props" @change="handleChange"></el-cascader>
                </el-form-item>
              </el-tab-pane>
              <!-- 动态参数部分 -->
              <el-tab-pane label="商品参数" name="1">
                <el-form-item :label="item.attr_name" v-for="item in manyAttrList" :key="item.attr_id" >
                  <el-checkbox-group v-model="item.attr_vals" size="mini">
                    <el-checkbox v-for="(item1, index) in item.attr_vals" :key="index" :label="item1" border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <!-- 静态属性部分 -->
              <el-tab-pane label="商品属性" name="2">
                <el-form-item :label="item.attr_name" v-for="item in onlyAttrList" :key="item.attr_id" >
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <!-- 商品图片部分 -->
              <el-tab-pane label="商品图片" name="3">
                <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="uploadHeader" :on-success="uploadSuccess">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
                  <img :src="src" alt="">
                </el-dialog>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                <!-- 富文本编辑器 -->
                <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                <!-- 添加按钮 -->
                <el-button class="addBtn" type="primary" @click="add">添加商品</el-button>
              </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      // 控制tab栏和步骤条联动
      activeIndex: '0',
      // 添加商品表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 添加商品验证规则
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 级联选择器配置对象
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 分类数据列表
      cateList: [],
      // 动态参数列表
      manyAttrList: [],
      // 静态属性列表
      onlyAttrList: [],
      // 图片上传请求头对象
      uploadHeader: {
        Authorization: sessionStorage.getItem('token')
      },
      // 控制图片预览对话框的显示与隐藏
      imgDialogVisible: false,
      src: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
    },
    // 级联选择器发生改变时
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 当用户切换tab栏时
    beforeLeave (activeName, oldActiveName) {
      // 判断用户当前所处的是否是第一栏  并且用户有么有选择商品分类
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        // 阻止用户切换并提示用户选择商品分类
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClick () {
      // 如果用户点击的是动态参数tab栏
      if (this.activeIndex === '1') {
        // 获取动态参数列表
        const { data: res } = await this.$http.get(`categories/${this.getCateId}/attributes`, { params: { sel: 'many' } })
        // 判断参数是否获取成功
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
        // 遍历参数数组  将参数中的参数值转换为数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        // 将参数数据保存到data中
        this.manyAttrList = res.data
      } else if (this.activeIndex === '2') {
        // 如果用户点击的是静态属性tab栏  获取静态属性列表
        const { data: res } = await this.$http.get(`categories/${this.getCateId}/attributes`, { params: { sel: 'only' } })
        // 判断属性是否获取成功
        if (res.meta.status !== 200) return this.$message.error('获取属性列表失败')
        // 将属性保存到data中
        this.onlyAttrList = res.data
      }
    },
    // 点击预览图片时触发
    handlePreview (file) {
      this.src = file.response.data.url
      this.imgDialogVisible = true
    },
    // 移除图片时触发
    handleRemove (file) {
      // 获取将要移除的图片的临时路径
      const tmpPath = file.response.data.tmp_path
      // 从pics数组中找到要移除的图片的索引
      const index = this.addForm.pics.findIndex(item => {
        return item.pic === tmpPath
      })
      // 从pics数组中删除该图片
      this.addForm.pics.splice(index, 1)
    },
    // 图片上传成功时触发
    uploadSuccess (res) {
      // 将上传成功的图片的临时地址添加到表单对象中
      this.addForm.pics.push({ pic: res.data.tmp_path })
    },
    // 添加商品
    add () {
      // 对表单预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请先填写商品信息')
        // 处理goods_cat
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyAttrList.forEach(item => {
          const info = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(info)
        })
        // 处理静态属性
        this.onlyAttrList.forEach(item => {
          const info = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(info)
        })
        form.attrs = this.addForm.attrs
        // 发送请求
        const { data: res } = await this.$http.post('goods', form)
        // 判断是否添加成功
        if (res.meta.status !== 201) return this.$message.error('商品添加失败')
        this.$message.success('商品添加成功')
        // 编程式导航到商品列表页面
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    getCateId () {
      // 判断当前用户选择的是否是三级分类
      if (this.addForm.goods_cat.length === 3) {
        // 返回用户当前选择的分类的id
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
    margin: 0 10px 0 0 !important;
}
img {
    width: 100%;
}
.addBtn {
  margin-top: 20px;
}
</style>
