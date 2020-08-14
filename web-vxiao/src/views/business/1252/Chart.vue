<template>
  <div>
    <div class="chart" v-if="page==='chart'">
      <div class="bg" :style="{backgroundImage:`url(${Bg})`}">
        <div class="sg">
          <div id="sg" ref="sg">
          </div>
          <div class="overlay">
            <div class="h1 step">{{tweenedStep}}步</div>
            <div class="h2">{{sportSummary.kilometre}}公里，{{sportSummary.calorie}}卡路里</div>
          </div>
        </div>
      </div>
      <div id="line">
      </div>
      <div id="line1">
      </div>
    </div>
  </div>
</template>
<script>
  'use strict'
  import * as Bg from './bg.png'
  import http from '@/utils/http'
  let highcharts = require('highcharts')
  require('highcharts/highcharts-more')(highcharts)
  require('highcharts/modules/solid-gauge.js')(highcharts)
  export default {
    data() {
      return {
        page: 'chart',
        value: 0,
        step: 0,
        tweenedStep: 0,
        kilometre: 0,
        calorie: 0,
        sdate: '',
        today: '',
        line_desc: '',
        target: 10000,
        tab: 2,
        sportSummary: {
          step: 0,
          kilometre: 0,
          calorie: 0
        }
      }
    },
    created() {
      this.getData(this.tab)
    },
    mounted() {},
    methods: {
      getData(type) {
        this.page = 'chart'
        let options = {
          headers: {
            ClientId: this.$route.query.clientId,
            tokenId: this.$route.query.token
          },
          params: {
            userId: this.$route.query.userId,
            determinationId: this.$route.query.determinationId
          }
        }
        http.get(`/business/sportdetermination/user/detail`, options).then(
          data => {
            if (data && data.sportSummary) {
              this.step = data.sportSummary.step
              this.sportSummary = data.sportSummary
              // this.setSolidGauge(0, 0, this.sportSummary.kilometre, this.sportSummary.calorie)
              this.setLine('line', (data.sportSummary.heartRates || []).map(v => v.stime), (data.sportSummary.heartRates ||
                  [])
                .map(
                  v => v.heartRate)
                )
              this.setLine('line1', (data.sportSummary.heartRates || []).map(v => v.stime), (data.sportSummary.heartRates ||
                  [])
                .map(
                  v => v.step)
                )
            } else {
              this.step = 0
              this.kilometre = 0
              this.calorie = 0
              this.setSolidGauge(0, this.step, this.kilometre, this.calorie)
              this.setLine('line', [], [])
            }
          })
      },
      setSolidGauge: function (value, step, kilometre, calorie) {
        highcharts.chart(this.$refs.sg, {
          title: {
            text: ''
          },
          credits: {
            enabled: false
          },
          chart: {
            type: 'solidgauge',
            height: '105%',
            backgroundColor: 'transparent'
          },
          pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{
              outerRadius: '112%',
              innerRadius: '107%',
              backgroundColor: 'rgba(255,255,255,.2)',
              borderWidth: 0
            }]
          },
          yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
          },

          plotOptions: {
            solidgauge: {
              dataLabels: {
                enabled: false
              },
              linecap: 'round',
              stickyTracking: false,
              wrap: false
            },
            series: {
              animation: false
            }
          },
          series: [{
            name: 'Move',
            data: [{
              color: '#fff',
              radius: '112%',
              innerRadius: '107%',
              y: value
            }]
          }]
        })
        if (step) {
          this.step = step
        }
        this.kilometre = kilometre
        this.calorie = calorie
      },
      setLine: function (id, dates, datas) {
        highcharts.chart(id, {
          chart: {
            backgroundColor: '#fff7f4',
            radius: '8px',
            type: 'spline',
            width: window.innerWidth - 20,
            height: Math.floor(window.innerHeight * 0.3)
          },
          title: {
            text: ''
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: dates,
            tickWidth: 0,
            gridLineWidth: 0,
            lineWidth: 0
          },
          yAxis: {
            gridLineWidth: 0,
            labels: {
              enabled: true
            },
            title: {
              text: ''
            }
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: false
              },
              enableMouseTracking: false
            },
            series: {
              lineColor: '#ff6a6b',
              marker: {
                fillColor: '#ff6a6b',
                lineColor: '#ff6a6b'
              }
            }
          },
          tooltip: {
            borderColor: '#ff6a6b',
            pointFormat: '<span style="color:#2ebd60">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
          },
          series: [{
            name: id === 'line' ? 'BPM' : '步数',
            data: datas
          }]
        })
      }
    },
    watch: {
      step(newVal) {
        let timer
        let func = () => {
          if (this.tweenedStep !== newVal) {
            this.tweenedStep += 1
            if (newVal - this.tweenedStep > 10) {
              this.tweenedStep += 10
            }
            if (newVal - this.tweenedStep > 1000) {
              this.tweenedStep += 100
            }
            if (newVal - this.tweenedStep > 10000) {
              this.tweenedStep += 1000
            }
            if (this.tweenedStep > newVal) {
              this.tweenedStep = newVal
            }
            timer = requestAnimationFrame(func)
          } else {
            cancelAnimationFrame(timer)
          }
        }
        func()
      }
    },
    computed: {
      Bg() {
        return Bg
      },
      animatedStep() {
        return this.tweenedStep
      },
      isPoint() {
        return this.$route.query.point === '1'
      },
      isArrow() {
        return this.$route.query.isArrow === '1'
      }
    }
  }

</script>
<style lang="scss">
  html {
    // overflow: scroll !important;
    background: #fff;
  }

  .chart {
    height: 100vh;
    padding-bottom: 16px;
  }

  .chart,
  .groups {
    background: #fff;
  }

  .bg {
    background-position: center;
    background-size: cover;
    overflow: hidden;
    .desc {
      color: #fff;
    }
    .h1 {
      color: #fff;
    }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 40px;
  }

  .jac {
    justify-content: center;
    align-items: center;
  }

  .desc {
    font-size: 16px;
    color: #9f9f9f
  }

  #sg {
    width: 240px;
    height: 240px;
    position: relative;
    margin: 0 auto;
  }

  .line {
    padding: 0 10px;
    overflow: hidden;
  }

  .sg {
    margin-bottom: 10px;
    position: relative;
  }

  [class$=_h1] {
    line-height: 2;
    margin-top: 10px;
  }

  .h1 {
    text-align: center;
    z-index: 99;
    position: relative;
    line-height: 2;
  }

  .overlay {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: transparent !important;
  }

  .overlay .h1 {
    position: relative;
    color: #fff;
    font-size: 42px;
    line-height: 1;
    margin-bottom: 10px;
  }

  #line {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #line1 {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .overlay .h2 {
    font-size: 14px;
    color: #fff;
    line-height: 1;
  }

  .tabs {
    background: url('~images/btn/icon_btn@2x.png') no-repeat center/ cover;
    width: 68px;
    height: 24px;
    padding: 0 !important;
  }

  .tab {
    font-size: 15px;
    color: #9f9f9f;
    width: 34px;
    text-align: center;
    height: 24px;
    cursor: pointer;
    line-height: 24px;
  }

  .tabs.left .tab:nth-child(1) {
    color: #fff;
    background: url('~images/btn/icon_btn_press@2x.png') no-repeat center/ cover;
  }

  .tabs.right .tab:nth-child(2) {
    color: #fff;
    background: url('~images/btn/icon_btn_press@2x.png') no-repeat center/ cover;
  }

  .tabCtns {
    margin-top: 20px;
    padding-bottom: 100px;
  }

  .block {
    .num {
      color: #ff6a6b;
      font-size: 24px;
    }
    line-height: 1.5;
    text-align: center;
    &.mt10 {
      margin-top: 10px;
    }
    .black {
      font-size: 16px;
      color: #333;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    &.between {
      justify-content: space-around;
      width: 100%;
    }
    &.col {
      flex-direction: column;
    }
  }

  .desc.userName {
    position: relative;
    &.hidePoint::before {
      display: none;
    }
    &.hideArrow::after {
      display: none;
    }
    &::before {
      position: absolute;
      content: "";
      display: block;
      background: red;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      left: -20px;
      top: 50%;
      box-shadow: 0px 0px 5px rgba(255, 255, 255, 1);
      margin-top: -4px;
      animation: scale 2s linear infinite both;
    }
    &::after {
      position: absolute;
      content: "";
      display: block;
      background: url('./arrow.png') no-repeat center / cover;
      width: 10px;
      height: 18px;
      right: -20px;
      top: 50%;
      margin-top: -8px;
    }
  }

  .groups {
    background: #fff;
    .border {
      border-bottom: 1px solid #ebebeb;
    }
  }

  @keyframes scale {
    0% {
      transform: scale(.8)
    }
    50% {
      transform: scale(1)
    }
    100% {
      transform: scale(.8)
    }
  }

  .cc {
    justify-content: center;
    align-items: center;
  }

</style>
