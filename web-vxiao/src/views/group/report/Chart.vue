<template>
  <div id="chart"
       ref='chart'
       :style="prefixCls">{{nullText}}</div>
</template>
<script>
import Check from '@/utils/check'
import Api from './api'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/radar')
require('echarts/lib/chart/line')
export default {
  name: 'chart',
  props: {
    params: { type: Object }
  },
  components: {},
  data() {
    return {
      nullText: '',
      chartType: ''
    }
  },
  computed: {
    prefixCls() {
      return {
        width: `100%`,
        height: `450px`
      }
    }
  },
  created() {
    let params = { ...this.$route.query }
    Api.loadReportData(params).then(res => {
      if (res.table) {
        let dt = res.table.chart || {}
        switch (dt.showType) {
          case 'bar':
            setTimeout(() => {
              this.drawBar({
                xAxis: dt.xAxis,
                series: dt.series
              })
            }, 100)
            break
          case 'line':
            this.chartType = 'line'
            this.drawLine({
              xAxis: dt.xAxis,
              series: dt.series
            })
            break
          default:
            break
        }
        // 雷达图单独处理
        if (res.table.hasOwnProperty('radarChartData')) {
          this.chartType = 'radar'
          setTimeout(() => {
            if (!res.table.radarChartData.data) {
              this.nullText = '暂无数据'
              return
            }
            this.drawRadar(res.table.radarChartData)
          }, 100)
        }
      }
    })
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

        echarts.init(this.$refs.chart).setOption({
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
    drawRadar(data) {
      echarts.init(this.$refs.chart).setOption({
        radar: {
          indicator: data.indicators,
          center: ['50%', '50%'],
          radius: 80
        },
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [
              {
                value: data.data,
                label: {
                  normal: {
                    show: true,
                    formatter: function(params) {
                      return params.value
                    }
                  }
                }
              }
            ]
          }
        ]
      })
    },
    drawLine(data) {
      let option = {
        xAxis: {
          type: 'category',
          data: data.xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data.series[0].data,
            type: 'line'
          }
        ]
      }
      echarts.init(this.$refs.chart).setOption(option)
    }
  }
}
</script>
<style lang="scss">
  #chart {
    margin: 0 auto;
    max-height: rem(600);
  }
</style>
