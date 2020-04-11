<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb title1="数据统计" title2="数据报表"></breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {

  },
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))
    // 获取数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('数据获取失败')
    // 将服务器端返回的数据和options对象合并
    const result = _.merge(res.data, this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
