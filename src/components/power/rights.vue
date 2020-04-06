<template>
  <div>
      <!-- 面包屑导航 -->
    <breadcrumb title1="权限管理" title2="权限列表"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
        <!-- 权限列表 -->
      <el-table :data="rightsList" border style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
                <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRights()
  },
  methods: {
    // 获取权限列表
    async getRights () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('权限列表获取失败')
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
