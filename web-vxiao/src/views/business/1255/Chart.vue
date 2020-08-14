<template>
  <div id="pie"
       ref='_pie'
       :style="prefixCls"></div>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  export default {
    mixins: [R],
    props: {
      date: { type: String },
      msgId: { type: Number }
    },
    data() {
      return {
        dateTime: this.date,
        chart: null
      }
    },
    components: {},
    created() {
      this.fetchData()
    },
    computed: {
      prefixCls() {
        return {
          width: `100%`,
          height: `250px`
        }
      }
    },
    methods: {
      fetchData() {
        let date = this.dateTime || this.routeQuery('date')
        let msgId = this.msgId || this.routeQuery('msgId')

        let tokenId = this.routeQuery('tokenId')
        let clientId = this.routeQuery('clientId')
        if (tokenId) {
          this.$http.defaults.headers.common['clientId'] = clientId
          this.$http.defaults.headers.common['tokenId'] = tokenId
        }

        if (this.chart) {
          this.chart.clear()
        }

        Api.getPieData(msgId, date).then(res => {
          if (res.datas) {
            this.drawPie(res.datas)
          }
        })
      },
      drawPie(values) {
        let data = values.map(v => {
          return {
            ...v,
            label: v.name,
            name: `${v.name}：${v.value}人`
          }
        })

        let lData = data.map(v => {
          return v.name
        })
        let chart = echarts.init(this.$refs._pie)
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: params => {
              return `${params.seriesName}\n${params.name}（${params.data.data}）`
            }
          },
          legend: {
            orient: 'vertical',
            y: 'center',
            x: '60%',
            data: lData,
            textStyle: {
              fontSize: 14
            }
          },
          series: [
            {
              name: '打卡情况',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['35%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter: params => {
                    if (params.value === data[0].value) {
                      return `${params.data.data}\n${params.name}`
                    }
                    return ''
                  },
                  textStyle: {
                    fontSize: 18,
                    color: '#444',
                    lineHeight: 200
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: data
            }
          ],
          color: ['#00cd60', '#a78afb']
        }
        chart.setOption(option)
        this.chart = chart
      }
    },
    watch: {
      date(val) {
        this.dateTime = val
        this.fetchData()
      }
    }
  }
</script>
<style lang="scss">
  #pie {
    margin: 0 auto;
    max-height: rem(300);
  }
</style>
