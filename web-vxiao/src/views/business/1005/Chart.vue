<template>
  <div id="chart">
    <template v-if="groupType=='5'">
      <div id="chart-title"
           v-html="title"></div>
    </template>
    <template v-else-if="isWeb">
      <item @click="handleStudent">
        <div slot="main">学生</div>
        <div slot="remark"
             v-html="title"></div>
      </item>
    </template>
    <div id="radar"
         ref='_radar'
         :style="prefixCls"></div>
  </div>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/radar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
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
      const ps = this.params || {}
      let userId = this.routeQuery('userId')
      let tp = this.getStorage('_summary_type_cache', true)
      if (tp === 'chart') {
        let user = this.getStorage('_summary_user_cache') || {}
        userId = user.userId
        this.getStorage('_summary_type_cache')
      }

      let groupId = ps.groupId || this.routeParam('groupId')
      let startDate = ps.startDate || this.routeQuery('startDate')
      let endDate = ps.endDate || this.routeQuery('endDate')
      let timeType = ps.timeType || this.routeQuery('timeType')

      let tokenId = this.routeQuery('tokenId')
      let clientId = this.routeQuery('clientId')
      if (tokenId) {
        this.$http.defaults.headers.common['clientId'] = clientId
        this.$http.defaults.headers.common['tokenId'] = tokenId
      }

      Api.loadRadarData({
        groupId: groupId,
        timeType: timeType,
        startTime: startDate,
        endTime: endDate,
        userId: userId
      }).then(res => {
        if (res.randarDatas) {
          this.title = res.remark
          this.$web.postJsAction({
            type: 'evaluate_chart_title',
            content: this.title
          })
          this.drawRadar(res.randarDatas.evaluations[0])
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
      drawRadar(data) {
        let d = []
        let v = []

        for (let i = 0; i < data.datas.length; i++) {
          d.push({ text: `${data.datas[i].name}\n${data.datas[i].count}`, max: data.datas[i].data })
          v.push(data.datas[i].value)
        }

        echarts.init(this.$refs._radar).setOption({
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
      },
      handleStudent() {
        this.setStorage('_summary_type_cache', 'chart')
        this.routePush({ name: 'selectStudent1005' })
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

  #radar {
    margin: 0 auto;
    max-height: rem(600);
  }
</style>
