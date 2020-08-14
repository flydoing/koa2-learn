<template>
  <!-- 连线题 -->
  <div class="matching">
    <Titleview :title="question.title||question.content"
               :serial="serial"
               :isAnaly="isAnaly"></Titleview>
    <div class="matching-options"
         v-if="isTeacher">
      <!-- 老师 查看答卷 -->
      <div class="matching-options-left">
        <template v-if="question.options.length>0">
          <div v-for="(option, o) in question.options.filter((o) => {return o.sort === 1})"
               :key="o">{{option.content}}</div>
        </template>
      </div>
      <div class="matching-options-line"></div>
      <div class="matching-options-right">
        <template v-if="question.options.length>0">
          <div v-for="(option, o) in question.options.filter((o) => {return o.sort === 2})"
               :key="o">{{option.content}}</div>
        </template>
      </div>
    </div>
    <div class="matching-options"
         v-if="!isTeacher && routeQuery('pageType') ==='studentReview'"
         ref="matchingBox2">
      <!-- 学生、家长 查看答卷 -->
      <div class="matching-options-left"
           style="margin-left: 10px;">
        <template v-if="question.options.length>0">
          <div v-for="(option, o) in question.options.filter((o) => {return o.sort === 1})"
               :key="o"
               :ref="option.id">{{option.content}}</div>
        </template>
      </div>
      <div class="matching-options-line">
        <svg ref="lineShow"
             height="0"
             width="256">
          <template v-if="lines.length>0">
            <line x1="5"
                  x2="251"
                  :y1="line.y1"
                  :y2="line.y2"
                  v-for="(line, l) in lines"
                  :key="l"
                  :stroke="line.color"
                  style="stroke-width: 1px;"></line>
          </template>
        </svg>
      </div>
      <div class="matching-options-right"
           v-if="question.options.length>0">
        <div v-for="(option, o) in question.options.filter((o) => {return o.sort === 2})"
             :key="o"
             :ref="option.id">{{option.content}}</div>
      </div>
    </div>
    <div class="matching-options"
         v-if="!isTeacher && routeQuery('pageType')==='studentReply'"
         ref="drawBox">
      <!-- 学生、家长 提交答卷 -->
      <div class="matching-options-left"
           v-if="question.options.length>0">
        <div v-for="(option, o) in question.options.filter((o) => {return o.sort === 1})"
             :key="o"
             @click="optionClick(option)"
             :class="{'selected': option.selected || option.active}"
             :ref="option.id">{{option.content}}</div>
      </div>
      <div class="matching-options-line">
        <svg ref="drawLine"
             height="0"
             width="256">
          <template v-if="studentLines.length > 0">
            <line x1="5"
                  x2="251"
                  :y1="line.y1"
                  :y2="line.y2"
                  v-for="(line, l) in studentLines"
                  :key="l"
                  stroke="#2dbd60"
                  style="stroke-width: 1px;"></line>
          </template>
        </svg>
      </div>
      <div class="matching-options-right"
           v-if="question.options.length>0">
        <div v-for="(option, o) in question.options.filter((o) => {return o.sort === 2})"
             :key="o"
             @click="optionClick(option)"
             :class="{'selected': option.selected || option.active}"
             :ref="option.id">{{option.content}}</div>
      </div>
    </div>
    <template v-if="question.datas && !isAnaly">
      <item v-for="(data, d) in question.datas"
            :key="d"
            :noborder="true"
            @click="itemClick(data)">
        <div>{{data.key}}</div>
        <div slot="remark">{{data.value}}</div>
      </item>
    </template>
    <AnalysisEnter :praxisId="praxisId"
                   :questionId="question.id"
                   :isAnaly="isAnaly"
                   v-if="showAnalyEnter()"
                   :quetionData="question"></AnalysisEnter>
    <div class="matching-readCount"
         v-if="showAcountBar()">已答{{question.joinCount}}</div>
  </div>
</template>
<script>
  import Mixin1047 from '../mixin'
  export default {
    mixins: [Mixin1047],
    props: {
      question: {
        type: Object,
        default() {
          return {}
        }
      },
      serial: {
        type: Number,
        default: null
      },
      praxisId: {
        type: [Number, String],
        default: null
      },
      isAnaly: {
        type: Boolean,
        default: false
      },
      isCompose: {
        type: Boolean,
        default: false
      },
      isFromPraxis: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        lines: [],
        studentLines: [],
        start: null
      }
    },
    mounted() {
      const that = this
      if (that.routeQuery('pageType') === 'studentReply') {
        let h =
          that.question.options.filter(o => {
            return o.sort === 2
          }).length * 51
        that.$refs.drawLine.style.height = h
        that.$refs.drawLine.style.width = 256 + 'px'
      }
      if (that.routeQuery('pageType') !== 'studentReview') {
        return false
      }
      setTimeout(() => {
        let h =
          that.question.options.filter(o => {
            return o.sort === 2
          }).length * 51
        that.$refs.lineShow.style.height = h
        that.$refs.lineShow.style.width = 256 + 'px'
        that.question.options.forEach(o => {
          if (o.sort === 1 && o.answerContent) {
            let ids = JSON.parse(o.answerContent)
            ids.forEach(id => {
              let startDom = that.$refs[o.id][0]
              let endDom = that.$refs[id][0]
              that.lines.push({
                y1: startDom.offsetTop - that.$refs.matchingBox2.offsetTop + startDom.offsetHeight / 2,
                y2: endDom.offsetTop - that.$refs.matchingBox2.offsetTop + endDom.offsetHeight / 2,
                color: o.isCorrent === 1 ? '#00C162' : 'red'
              })
            })
          }
        })
      }, 1000)
    },
    methods: {
      itemClick(data) {
        this.routePush({
          name: 'answerUsers1047',
          query: {
            questionId: this.question.id,
            type: data.type,
            questionType: this.question.type,
            titleText: data.key
          }
        })
      },
      optionClick(option) {
        let leftOptions = this.question.options.filter(res => {
          return res.sort === 1
        })
        let rightOptions = this.question.options.filter(res => {
          return res.sort === 2
        })
        // sort===1 代表点击了左边选项，否则代表点击了右边的选项
        if (option.sort === 1) {
          this.ruleData(leftOptions, option)
        } else {
          this.ruleData(rightOptions, option)
        }
      },
      ruleData(data, option) {
        // 如果上一次已经选了某一边的选项，并且第二次点击的与第一次不在同一边，可以画线
        if (this.start && option.sort !== this.start.sort) {
          let end = option
          if (end.selected) {
            this.start = null
            return false
          }
          this.$set(option, 'active', 1)
          this.question.options.forEach(o => {
            if (o.active) {
              o.selected = 1
              o.active = 0
            }
          })
          let starDom = this.$refs[this.start.id][0]
          let endDom = this.$refs[end.id][0]
          let y1 = null
          let y2 = null
          if (option.sort === 2) {
            y1 = starDom.offsetTop - this.$refs.drawBox.offsetTop + starDom.offsetHeight / 2
            y2 = endDom.offsetTop - this.$refs.drawBox.offsetTop + endDom.offsetHeight / 2
          } else {
            y2 = starDom.offsetTop - this.$refs.drawBox.offsetTop + starDom.offsetHeight / 2
            y1 = endDom.offsetTop - this.$refs.drawBox.offsetTop + endDom.offsetHeight / 2
          }
          this.studentLines.push({
            y1: y1,
            y2: y2,
            start: this.start,
            end: end,
            startId: this.start.id,
            endId: end.id
          })
          this.ruleOptions(this.studentLines)
          this.start = null
        } else {
          if (option.selected) {
            let deleteIndex = null
            this.studentLines.forEach((line, i) => {
              if (line.startId === option.id || line.endId === option.id) {
                deleteIndex = i
                this.question.options.forEach(o => {
                  if (o.id === line.startId || o.id === line.endId) {
                    o.selected = 0
                  }
                })
              }
            })
            this.studentLines.splice(deleteIndex, 1)
            this.ruleOptions(this.studentLines)
            this.start = null
            return false
          }
          // 左边是否已选中某一选项
          let hasActive = data.some(o => {
            return o.active === 1
          })
          // 当已有选中的选项，分两种情况，
          if (hasActive) {
            // 1.再次点击选中的选项，则清除选中的状态active，
            if (option.active) {
              this.$set(option, 'active', 0)
            } else {
              // 2.选择其他选项，则清楚上一次选中选项的选中状态active
              data.forEach(o => {
                this.$set(o, 'active', 0)
              })
              this.$set(option, 'active', 1)
              this.start = option
            }
          } else {
            this.$set(option, 'active', 1)
            this.start = option
          }
        }
      },
      ruleOptions(arr) {
        let studentAnswers = []
        arr.forEach((item, i) => {
          studentAnswers.push({
            id: item.start.id,
            sort: item.start.sort,
            serialNumber: String.fromCharCode(i + 65)
          })
          studentAnswers.push({
            id: item.end.id,
            sort: item.end.sort,
            serialNumber: String.fromCharCode(i + 65)
          })
        })
        this.$set(this.question, 'studentAanswers', studentAnswers)
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .matching {
    padding: 0 rem(10);
    &-options {
      margin: 0 auto;
      padding-left: rem(10);
      @include flex;
      &-left {
        flex: 3;
        div {
          padding: rem(10) 0;
          margin-bottom: rem(10);
          border: 1px solid #ededed;
          text-align: center;
          cursor: pointer;
        }
        .selected {
          border: 1px solid #2dbd60;
        }
      }
      &-right {
        flex: 3;
        div {
          padding: rem(10) 0;
          margin-bottom: rem(10);
          border: 1px solid #ededed;
          text-align: center;
          cursor: pointer;
        }
        .selected {
          border: 1px solid #2dbd60;
        }
      }
      &-line {
        flex: 4;
      }
    }
    &-readCount {
      padding: 0 rem(10) rem(10);
    }
  }
</style>
