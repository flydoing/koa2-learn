<template>
  <div class="chart-cloud-container">
    <div class="chart-title">
      <p class="title">{{title}}</p>
    </div>
    <!-- 加载提示 -->
    <div v-if="loading"
         class="loading">加载中...</div>
    <!-- 3d版 -->
    <div v-if="cloudType === '3'"
         class="chart-3d">
      <tag-cloud :data="hotTag"
                 :config="config"
                 @clickTag="clickTagItem"></tag-cloud>
    </div>
    <!-- 平面版 -->
    <div v-if="cloudType === '1'"
         class="chart-3d"
         ref='chart3d'
         :style="prefixCls">
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import tagCloud from 'v-tag-cloud'
  import Api from './api'
  import R from '@/views/group/mixin'
  Vue.use(tagCloud)
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  require('echarts-wordcloud')
  export default {
    name: 'chartCloud',
    components: {},
    mixins: [R],
    computed: {
      prefixCls() {
        return {
          // width: `100%`,
          // height: `calc(100vh - 85px)`,
          // marginTop: `85px`
        }
      }
    },
    data() {
      return {
        loading: true,
        cloudType: '2', // 1：平面版，3：3d版
        title: '',
        hotTag: [],
        config: {
          radius: 420, // 滚动半径，单位px
          maxFont: 40, // 最大字体大小
          color: null, // 字体颜色。为空时随机
          rotateAngleXbase: 800, // 默认旋转速度基数，数越小速度越快
          rotateAngleYbase: 800,
          hover: true // 是否开启悬浮联动
        },
        timerFetchData: null
      }
    },
    created() {
      this.$nextTick(() => {
        // this.drawCloud()
        this.fetchData()
      })
      this.title = this.$route.query.title
      this.cloudType = this.$route.query.cloudType
      const that = this
      this.timerFetchData = setInterval(function() {
        that.fetchData()
      }, 60000)
    },
    beforeDestroy() {
      clearInterval(this.timerFetchData)
    },
    methods: {
      fetchData() {
        let questionid = this.$route.query.questionid
        if (!questionid) {
          return
        }
        Api.getWordcloud(questionid).then(res => {
          if (res.code === '1') {
            // this.hotTag = res.datas || [{ name: '暂无数据', value: 1 }]
            let datas = res.datas || [{ name: '暂无数据', value: 1 }]
            this.initDatas(datas)
          } else {
            this.hotTag = [{ name: '暂无数据', value: 1 }]
          }
        })
      },
      initDatas(datas) {
        // 先排序，取前30个
        let sortObj = datas.sort(this.compare('value'))
        if (this.cloudType === '3' && sortObj.length > 30) {
          sortObj = sortObj.slice(0, 30)
        }
        this.loading = false
        this.hotTag = sortObj
        if (this.cloudType === '1') {
          this.drawCloud()
        }
      },
      compare(property) {
        return function(obj1, obj2) {
          var value1 = obj1[property]
          var value2 = obj2[property]
          // return value1 - value2 // 升序
          return value2 - value1 // 降序
        }
      },
      clickTagItem(tag) {
        this.$message({ message: `${tag.name}: ${tag.value}`, type: 'success' })
      },
      drawCloud() {
        // 云词数据
        const that = this
        let wordcloudRef = echarts.init(this.$refs.chart3d)
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
              width: '100%',
              height: '100%',
              right: null,
              bottom: null,
              sizeRange: [20, 60],
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
              data: that.hotTag || [{ name: '暂无数据', value: 1 }]
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
  .chart-cloud-container {
    display: flex;
    flex-direction: column;
    position: relative;
    text-align: center;
    width: 100%;
    height: 100vh;
    background: #fff;
    background-size: 100%;

    .loading {
      font-size: 24px;
      color: #2dbe60;
    }
    .chart-title {
      display: inline-flex;
      justify-content: center;
      margin-top: 40px;
      .title {
        padding: 8px 30px;
        font-size: 24px;
        color: #fff;
        border-radius: 10px;
        background: #2dbe60;
      }
    }
    .chart-3d {
      display: flex;
      width: 100%;
      height: calc(100vh - 85px);
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: rem(40);
      color: #fff;
      font-weight: lighter;
      letter-spacing: rem(1);
    }
    img {
      width: rem(442);
      height: rem(442);
      padding: rem(22);
      background: #fff;
      border-radius: rem(10);
      margin-top: rem(17);
      margin-bottom: rem(50);
    }
  }
</style>
