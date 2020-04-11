<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="商品管理" title2="商品列表"></breadcrumb>
    <el-card class="box-card">
      <!-- 搜索框和添加用户按钮 -->
      <el-row :gutter="20" class="top">
        <!-- 搜索框 -->
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryData.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border style="width: 100%">
          <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="748px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="80px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
            <template slot-scope="scope">
               {{scope.row.add_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(scope.row.goods_id)"></el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryData.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 保存商品数据
      goodsList: [],
      // 总数据条数
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品数据
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryData })
      this.total = res.data.total
      this.goodsList = res.data.goods
    },
    // 当每页显示的数据条数发生改变时
    handleSizeChange (newSize) {
      this.queryData.pagesize = newSize
      this.getGoodsList()
    },
    // 当前页改变时
    handleCurrentChange (newPage) {
      this.queryData.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    delGoods (id) {
      // 询问用户是否确认删除
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 用户确认删除  发送请求
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功!')
        if (this.queryData.pagenum !== 1 && this.goodsList.length === 1) {
          this.queryData.pagenum--
        }
        this.getGoodsList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加商品
    addGoods () {
      this.$router.push('/addgoods')
    }
  }
}
</script>

<style lang="less" scoped>
.top {
    margin-bottom: 20px;
}
</style>
