<template>
  <div v-if='isBar'
       id="barChart"
       ref='barChart'
       :style="prefixCls"></div>
  <div v-else
       id="radarChart"
       ref='radarChart'
       :style="prefixCls"></div>
</template>
<script>
  import Api from './api'

  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/bar')
  require('echarts/lib/chart/radar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  export default {
    name: 'chart',
    components: {},
    created() {},
    data() {
      return {
        isBar: false
      }
    },
    computed: {
      prefixCls() {
        return {
          width: `${document.body.clientWidth}px`,
          height: `${document.body.clientWidth}px`
        }
      }
    },
    methods: {
      drawBar(data) {
        let dateList = data.dateList
        let scoreList = data.scoreList

        // 最大值
        let max = parseFloat(scoreList[0])
        let len = scoreList.length
        for (let i = 1; i < len; i++) {
          let val = parseFloat(scoreList[i])
          if (val > max) {
            max = val
          }
        }

        let maxValue = 30
        if (max > 30 && max < 51) {
          maxValue = 50
        } else if (max > 50 && max < 81) {
          maxValue = 80
        } else if (max > 80) {
          maxValue = 100
        }

        echarts.init(this.$refs.barChart).setOption({
          title: {
            text: data.title,
            x: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#333' // 主标题文字颜色
            }
          },
          xAxis: [
            {
              type: 'category',
              data: dateList
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitNumber: 5,
              max: maxValue,
              axisLabel: {
                formatter: function(val) {
                  return val === 0 ? val : val + '%'
                }
              }
            }
          ],
          series: [
            {
              type: 'bar',
              data: scoreList,
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  formatter: function(val) {
                    return val.data + '%'
                  }
                }
              }
            }
          ]
        })
      },
      drawRadar(data) {
        let d = []
        let v = []

        for (let i = 0; i < data.datas.length; i++) {
          d.push({ text: data.datas[i].extension, max: 100 })
          v.push(data.datas[i].value)
        }

        echarts.init(this.$refs.radarChart).setOption({
          title: {
            text: data.title,
            x: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#000' // 主标题文字颜色
            }
          },
          name: {
            textStyle: {
              color: '#000',
              fontSize: 14,
              fontFamily: 'font',
              fontWeight: 'normal'
            }
          },
          polar: {
            indicator: d
          },
          series: [
            {
              type: 'radar',
              data: [
                {
                  value: v,
                  areaStyle: {
                    normal: {
                      opacity: 0.45,
                      color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                        {
                          color: '#ff8f3c',
                          offset: 0
                        }
                      ])
                    }
                  }
                }
              ]
            }
          ]
        })
      }
    },
    mounted() {
      let type = this.routeQuery('extensionType')
      let params = {
        ...this.$route.query
      }

      delete params.extensionType

      if (type === 'barChart') {
        this.isBar = true
        Api.loadBarData({ ...params }).then(res => {
          this.drawBar(res)
        })
      } else {
        Api.loadRadarData({ ...params }).then(res => {
          this.drawRadar(res)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  #radarChart,
  #barChart {
    margin: 0 auto;
    margin-top: rem(20) !important;
    max-height: rem(600);
  }

  .no-data {
    text-align: center;
    font-size: rem(14);
    margin-top: rem(20) !important;
  }
</style>
