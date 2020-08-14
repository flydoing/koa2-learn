<template>
  <page :title="pageName">
    <div class="chart-title">{{message}}</div>
    <div id="lineChart"
         ref='lineChart'
         :style="prefixCls"></div>
  </page>
</template>
<script>
  import Api from './detailApi'
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/line')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  export default {
    name: 'chart',
    components: {},
    created() {
      let that = this
      Api.getChartData(this.$route.query).then(res => {
        if (res && res.code === '1') {
          let option = that.ruleData(res.data)
          that.drawLine(option)
        }
      })
    },
    data() {
      return {
        message: '',
        colors: ['#dc5252', '#61eaa7', '#ba2fd4', '#f9cd2d', '#18d9e2', '#ec2351', '#c50ec7', '#666666', '#333', '#000'],
        pageName: this.routeQuery('pageName') || '联考图表'
      }
    },
    computed: {
      prefixCls() {
        return {
          width: '670px',
          height: `600px`
        }
      }
    },
    methods: {
      drawLine(d) {
        echarts.init(this.$refs.lineChart).setOption(d)
      },
      ruleData(d) {
        let that = this
        that.message = d.title
        d.scoreData = []
        for (let k in d) {
          let tempObj = {}
          switch (k) {
            case 'avg':
              tempObj.type = '平均分'
              tempObj.score = d.avg
              d.scoreData.push(tempObj)
              break
            case 'max':
              tempObj.type = '最高分'
              tempObj.score = d.max
              d.scoreData.push(tempObj)
              break
            case 'min':
              tempObj.type = '最低分'
              tempObj.score = d.min
              d.scoreData.push(tempObj)
          }
        }
        let option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            confine: true
          },
          legend: {
            data: [],
            top: '90%',
            padding: 5
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '18%',
            top: '6%',
            containLabel: true,
            show: false
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: '', // 横坐标文本
            show: true,
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dotted'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                type: 'dotted'
              }
            },
            axisLabel: {
              interval: 0,
              rotate: -90
            }
          },
          yAxis: {
            type: 'value',
            show: true,
            name: '',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dotted'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                type: 'dotted'
              }
            }
          },
          series: [] // 元素是对象，每个对象代表着一条线
        }
        option.xAxis.data = d.date
        d.scoreData.forEach((value, k) => {
          option.legend.data.push(value.type)
          option.series[k] = {
            name: value.type,
            type: 'line',
            smooth: true,
            data: value.score,
            color: [that.colors[k]],
            itemStyle: {
              normal: {
                borderWidth: 5,
                label: {
                  show: true
                }
              }
            },
            label: {
              show: true,
              normal: {
                show: false
              }
            }
          }
        })
        return option
      }
    }
  }
</script>
<style lang="scss">
  #lineChart {
    margin: 0 auto;
  }

  .chart-title {
    margin-top: rem(10);
    text-align: center;
  }
</style>
