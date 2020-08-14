<template>
  <div id="chart">
    <template v-if="groupType!=='5' && isWeb">
      <item @click="handleStudent">
        <div slot="main">学生</div>
        <div slot="remark"
             v-html="title"></div>
      </item>
    </template>
    <div id="bar"
         ref='_bar'
         :style="prefixCls"></div>
  </div>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'

  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/bar')
  export default {
    mixins: [R],
    props: {
      params: { type: Object }
    },
    data() {
      return {
        title: ''
      }
    },
    components: {},
    created() {
      let params = this.params || { ...this.$route.query }
      let user = this.getStorage('_1237_select_user_cache')
      if (user) {
        params.userId = user.userId
      }

      Api.getChartData(params.groupId, params).then(res => {
        if (res.table) {
          this.title = res.table.title
          this.$web.postJsAction({
            type: 'attandance_chart_title',
            content: this.title
          })

          let dt = res.table.chart || {}
          this.drawBar({
            xAxis: dt.xAxis,
            series: dt.series
          })
        }
      })
      this.groupType = this.currentGroup ? this.currentGroup.type : this.routeQuery('groupType')
    },
    computed: {
      prefixCls() {
        return {
          width: `100%`,
          height: `450px`
        }
      },
      isWeb() {
        if (/android/i.test(navigator.userAgent)) {
          return false
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
          return false
        }
        return true
      }
    },
    methods: {
      drawBar(data) {
        if (Check.isObject(data)) {
          // 最大值
          let values = data.series[0].data
          let max = parseFloat(values[0])
          for (let i = 1; i < values.length; i++) {
            let v = parseFloat(values[i])
            if (v > max) {
              max = v
            }
          }

          echarts.init(this.$refs._bar).setOption({
            xAxis: [
              {
                type: 'category',
                data: data.xAxis
              }
            ],
            yAxis: [
              {
                type: 'value',
                splitNumber: 5,
                max: max
              }
            ],
            series: [
              {
                type: 'bar',
                data: values,
                label: {
                  normal: {
                    show: true,
                    position: 'top'
                  }
                }
              }
            ]
          })
        }
      },
      handleStudent() {
        this.routePush({ name: 'selectStudent1237' })
      }
    }
  }
</script>
<style lang="scss">
  #chart {
    .vx-item {
      border-top: rem(1) solid #ededed;
    }
  }

  #chart-title {
    text-align: center;
    margin-top: rem(20) !important;
  }

  #bar {
    margin: 0 auto;
    max-height: rem(600);
  }
</style>
