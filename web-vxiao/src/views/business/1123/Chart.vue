<template>
  <div v-if="charts.length>0">
    <div v-for="(item, i) in charts"
         :key="i"
         class="chart"
         :id='chartId(item)'
         :style="prefixCls">
    </div>
  </div>
  <div v-else
       class="chart"
       ref='_chart'
       :style="prefixCls"></div>
</template>
<script>
  import Api from './api'

  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/radar')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  export default {
    name: 'chart',
    props: {
      params: { type: Object }
    },
    data() {
      return {
        colors: ['#dc5252', '#61eaa7', '#ba2fd4', '#f9cd2d', '#18d9e2', '#ec2351', '#c50ec7', '#666666', '#333', '#000'],
        charts: []
      }
    },
    components: {},
    computed: {
      prefixCls() {
        return {
          width: `100%`,
          height: `450px`
        }
      }
    },
    created() {
      let groupId = this.routeParam('groupId') || this.groupId
      let params = this.params || this.$route.query
      let tokenId = this.routeQuery('tokenId')
      let clientId = this.routeQuery('clientId')
      if (tokenId) {
        this.$http.defaults.headers.common['clientId'] = clientId
        this.$http.defaults.headers.common['tokenId'] = tokenId
      }

      Api.loadReportData('1123', groupId, {
        ...params,
        version: '2',
        noTempletReport: 1
      }).then(res => {
        if (res.table) {
          let dt = res.table.chart || {}
          switch (dt.showType) {
            case 'line':
              setTimeout(() => {
                this.drawLine({
                  xAxis: dt.xAxis,
                  series: dt.series
                })
              }, 100)
              break
            case 'radar':
              let num = Math.random(0, 999)
              this.charts.push({ chart: dt, num: num })
              setTimeout(() => {
                this.drawRadar({
                  xAxis: dt.xAxis,
                  series: dt.series,
                  id: `${num}_chart`,
                  title: dt.title
                })
              }, 100)
              break
            default:
              break
          }
        }
        if (res.tables) {
          res.tables.forEach((v, i) => {
            let dt = v.chart || {}
            let num = Math.random(0, 999)
            this.charts.push({ chart: dt, num: num })
            setTimeout(() => {
              this.drawRadar({
                xAxis: dt.xAxis,
                series: dt.series,
                id: `${num}_chart`,
                title: v.title
              })
            }, 100)
          })
        }
      })
    },
    methods: {
      chartId(item) {
        return `${item.num}_chart`
      },
      drawLine(data) {
        let keys = []
        let series = []
        data.series.forEach((v, i) => {
          keys.push(v.label)
          series.push({
            type: v.type,
            name: v.label,
            data: v.data,
            color: [this.colors[i]],
            smooth: true,
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
          })
        })
        echarts.init(this.$refs._chart).setOption({
          legend: {
            data: keys
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '18%',
            top: '10%',
            containLabel: true,
            show: false
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.xAxis, // 横坐标文本
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
          series: series
        })
      },
      drawRadar(data) {
        let datas = []
        let values = []
        data.series.forEach((v, i) => {
          datas.push({ text: v.label, max: v.max })
          values.push(v.value)
        })
        echarts.init(document.getElementById(data.id)).setOption({
          title: {
            text: data.title,
            left: 'center',
            padding: [15, 0, 0, 0],
            textStyle: {
              fontWeight: 'normal',
              fontSize: 14
            }
          },
          radar: {
            indicator: datas,
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
                  value: values
                }
              ]
            }
          ]
        })
      }
    }
  }
</script>
<style lang="scss">
  .chart {
    margin: 0 auto;
    max-height: rem(600);
  }
</style>
