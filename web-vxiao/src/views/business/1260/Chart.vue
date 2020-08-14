<template>
  <div class="chart-content">
    <div v-if="type === 'cloud'"
         class="btn-fullscreen btn-fullscreen1"
         @click="handleGotoCloud('1')"><img :src='icoFullScreen1' /></div>
    <div v-if="type === 'cloud'"
         class="btn-fullscreen"
         @click="handleGotoCloud('3')"><img :src='icoFullScreen3' /></div>
    <div id="chart"
         ref='chart'
         :style="prefixCls">
    </div>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/bar')
  require('echarts/lib/chart/radar')
  require('echarts/lib/chart/pie')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  require('echarts-wordcloud')
  export default {
    name: 'chart',
    props: {
      type: { type: String },
      chart: { type: Object },
      questionId: { type: Number }
    },
    data() {
      return {
        icoFullScreen3: `/static/ico/ico_fullScreen3.png`, // 3d
        icoFullScreen1: `/static/ico/ico_fullScreen.png` // 平面
      }
    },
    components: {},
    computed: {
      prefixCls() {
        return {
          width: `100%`,
          height: `300px`
        }
      }
    },
    created() {
      this.$nextTick(() => {
        switch (this.type) {
          case 'bar':
            this.drawBar(this.chart)
            // this.drawBar({
            //   keys: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            //   values: [10, 52, 200, 334, 390, 330, 220]
            // })
            break
          case 'pie':
            this.drawPie(this.chart)
            // this.drawPie({
            //   keys: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
            //   datas: [
            //     { value: 335, name: '直接访问' },
            //     { value: 310, name: '邮件营销' },
            //     { value: 234, name: '联盟广告' },
            //     { value: 135, name: '视频广告' },
            //     { value: 1548, name: '搜索引擎' }
            //   ]
            // })
            break
          case 'radar':
            this.drawRadar(this.chart)
            // this.drawRadar({
            //   values: [60, 73, 85, 40],
            //   datas: [{ text: '品牌', max: 100 }, { text: '内容', max: 100 }, { text: '可用性', max: 100 }, { text: '功能', max: 100 }]
            // })
            break
          case 'cloud':
            this.drawCloud()
            break
          default:
            break
        }
      })
    },
    methods: {
      drawBar(data) {
        if (Check.isObject(data)) {
          // 最大值
          let values = data.values
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
                data: data.keys
              }
            ],
            yAxis: [
              {
                type: 'value',
                splitNumber: 5,
                max: max
              }
            ],
            tooltip: {
              show: true
            },
            series: [
              {
                type: 'bar',
                data: values,
                center: ['50%', '50%'],
                label: {
                  normal: {
                    show: true,
                    position: 'top'
                  }
                },
                itemStyle: {
                  normal: {
                    color: function(params) {
                      let colors = ['#e690d1', '#32c5e9', '#ffdb5c', '#fb7293', '#67e0e3', '#e7bcf3', '#ff9f7f', '#9fe6b8', '#e062ae', '#37a2da']
                      return colors[params.dataIndex]
                    }
                  }
                }
              }
            ]
          })
        }
      },
      drawPie(data) {
        echarts.init(this.$refs.chart).setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          color: ['#e690d1', '#32c5e9', '#ffdb5c', '#fb7293', '#67e0e3', '#e7bcf3', '#ff9f7f', '#9fe6b8', '#e062ae', '#37a2da'],
          legend: {
            orient: 'vertical',
            left: 'left',
            data: data.keys
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: data.datas,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      },
      drawRadar(data) {
        echarts.init(this.$refs.chart).setOption({
          radar: {
            indicator: data.datas,
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
                  value: data.values
                }
              ]
            }
          ]
        })
      },
      handleGotoCloud(cloudType) {
        // 跳转ChartCloud
        window.open(`/html5/pages/chartCloud?questionid=${this.questionId}&title=${this.chart.title}&cloudType=${cloudType}`)
      },
      drawCloud() {
        // 云词数据
        const that = this
        let wordcloudRef = echarts.init(this.$refs.chart)
        wordcloudRef.setOption({
          tooltip: {
            show: true
          },
          series: [
            {
              type: 'wordCloud',
              shape: 'circle',
              left: 'center',
              top: 'center',
              width: '70%',
              height: '80%',
              right: null,
              bottom: null,
              sizeRange: [12, 60],
              rotationRange: [-90, 90],
              rotationStep: 45,
              gridSize: 8,
              drawOutOfBound: false,
              textStyle: {
                normal: {
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold',
                  // Color can be a callback function or a color string
                  color: function() {
                    // Random color
                    return 'rgb(' + [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',') + ')'
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: '#333'
                }
              },

              // Data is an array. Each array item must have name and value property.
              data: that.chart.datas || [{ name: '暂无数据', value: 1 }]
            }
          ]
        })
        // wordcloudRef.on('click', function(data) {
        //   window.open(`/html5/pages/chartCloud?questionid=${that.questionId}&title=${that.chart.title}`)
        // })
      }
    }
  }
</script>
<style lang="scss">
  #chart {
    margin: 0 auto;
    max-height: rem(600);
  }
  .chart-content {
    position: relative;
    .btn-fullscreen {
      position: absolute;
      z-index: 99;
      top: 5px;
      right: 5px;
      padding: 5px 25px;
      cursor: pointer;
      border-radius: 5px;
    }
    .btn-fullscreen1 {
      top: 45px;
    }
  }
</style>
