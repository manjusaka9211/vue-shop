<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{title1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{title2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ['title1', 'title2'],
  data () {
    return {}
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>
.bread {
    margin-bottom: 20px;
}
</style>
