<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="订单管理" title2="订单列表"></breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
        <el-row :gutter="20" class="top">
        <!-- 搜索框 -->
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryData.query" clearable @clear="getOrdersList">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80px">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.pay_status === '1'">已付款</el-tag>
                <el-tag type="danger" v-else-if="scope.row.pay_status === '0'">未付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="70px"></el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="180px">
            <template slot-scope="scope">
                {{scope.row.update_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row)"></el-button>
                <el-button type="success" icon="el-icon-location" size="mini" @click="showKuaidi"></el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryData.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
    <!-- 修改订单对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="40%" @close="clearEdit">
        <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
            <el-form-item label="省市区/县" prop="address1">
              <el-cascader v-model="editForm.address1" :options="cityData" :props="props"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
              <el-input v-model="editForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editOrder">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="kuaidiDialogVisible" width="40%">
        <el-timeline>
          <el-timeline-item v-for="(item,index) in kuaidiList" :key="index" :timestamp="item.ftime">
            {{item.context}}
          </el-timeline-item>
        </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单列表
      orderList: [],
      // 订单总数
      total: 0,
      // 控制修改订单对话框的显示与隐藏
      editDialogVisible: false,
      // 修改订单表单对象
      editForm: {
        address1: [],
        address2: ''
      },
      // 修改订单表单验证规则
      rules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      // 省市区数据
      cityData,
      // 级联选择器配置对象
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      // 控制物流信息对话框的显示与隐藏
      kuaidiDialogVisible: false,
      // 物流信息
      kuaidiList: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryData })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败！')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 每页显示的数据条数发生改变
    handleSizeChange (newSize) {
      this.queryData.pagesize = newSize
      this.getOrdersList()
    },
    // 页码发生改变
    handleCurrentChange (newPage) {
      this.queryData.pagenum = newPage
      this.getOrdersList()
    },
    // 用户点击修改按钮
    showEdit (order) {
      this.editDialogVisible = true
    },
    // 重置修改表单
    clearEdit () {
      this.$refs.editFormRef.resetFields()
    },
    // 用户点击确定
    editOrder () {
      // 预验证表单
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return false
        this.editDialogVisible = false
      })
    },
    // 查看物流信息
    async showKuaidi () {
      console.log('11')
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.kuaidiList = res.data
      this.kuaidiDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100% !important;
}
</style>
