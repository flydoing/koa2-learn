<template>
  <page title="解析">
    <div class="analy"
         v-if="question">
      <!-- <div :is="getPraxiStyle(question.type)" :question="question" :isAnaly="true"></div> -->
      <CommonPraxis :praxisType="getPraxiStyle(question.type)"
                    :question="question"
                    :isAnaly="true" />
      <div class="category-title"
           v-if="question.rightAnswer || options.length>0">正确答案</div>
      <div v-if="question.type==='17' && options.length>0"
           class="analy-options">
        <!-- 文字排序 解析 -->
        <div v-for="(option, o) in options"
             :key="o">{{option.content}}</div>
      </div>
      <div v-else-if="question.type==='16' && options.length>0"
           ref="matchingBox">
        <!-- 连线题 解析 -->
        <div class="matching-options"
             style="margin-top:10px;padding:0 10px;">
          <div class="matching-options-left"
               style="margin-left: 10px;">
            <div v-if="question.options.length>0"
                 v-for="(option, o) in question.options.filter((o) => {return o.sort === 1})"
                 :key="o"
                 :ref="option.id">{{option.content}}</div>
          </div>
          <div class="matching-options-line">
            <svg ref="answer"
                 height="0"
                 width="256">
              <line x1="5"
                    x2="251"
                    :y1="line.y1"
                    :y2="line.y2"
                    v-if="lines.length>0"
                    v-for="(line, l) in lines"
                    :key="l"
                    stroke="#000"
                    style="stroke-width: 1px;"></line>
            </svg>
          </div>
          <div class="matching-options-right">
            <div v-if="question.options.length>0"
                 v-for="(option, o) in question.options.filter((o) => {return o.sort === 2})"
                 :key="o"
                 :ref="option.id">{{option.content}}</div>
          </div>
        </div>
      </div>
      <div v-if="question.type === '13'">
        <!-- 图片排序 -->
        <div class="category-title"
             style="margin-top:10px;">正确答案</div>
        <img v-lazy="{src:url(question.medias[0].fileId),error:Image.ICO_USER}"
             alt='排序图片'
             style="padding: 10px 0;margin: 0 auto;max-width: 650px;">
      </div>
      <div class="analy-answer"
           v-html="question.rightAnswer"
           v-else></div>
      <div class="category-title">解析</div>
      <div class="analy-content"
           v-html="explain"></div>
    </div>
  </page>
</template>
<script>
  import Mixin1047 from '../mixin'
  import Api from '../api'
  export default {
    mixins: [Mixin1047],
    props: {
      praxisId: {
        type: [Number, String],
        default: null
      },
      isAnaly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        question: null,
        options: [],
        lines: []
      }
    },
    computed: {
      explain() {
        return this.question ? this.question.explain || '暂无内容' : '暂无内容'
      }
    },
    created() {
      const that = this
      if (that.routeQuery('praxisId') || that.praxisId) {
        Api.getQuetionById(that.routeQuery('praxisId') || that.praxisId, that.routeQuery('questionId')).then((res) => {
          that.question = res.praxis.questions[0]
          if (that.question.type === '17') {
            // 文字排序不返回 rightAnswer
            let options = that.question.options ? [...that.question.options] : []
            options
              .sort((a, b) => {
                return a.sort > b.sort
              })
              .forEach((o) => {
                that.options.push(o)
              })
          } else if (that.question.type === '16') {
            // 连线题
            that.options = [...that.question.options]
          }
        })
      } else {
        this.question = this.getStorage('question')
        if (that.question.type === '17') {
          // 文字排序不返回 rightAnswer
          let options = that.question.options ? [...that.question.options] : []
          options
            .sort((a, b) => {
              return a.sort > b.sort
            })
            .forEach((o) => {
              that.options.push(o)
            })
        } else if (that.question.type === '16') {
          // 连线题
          that.options = [...that.question.options]
        }
      }
    },
    mounted() {
      const that = this
      setTimeout(() => {
        if (that.question.type !== '16') {
          return false
        }
        let h =
          this.question.options.filter((o) => {
            return o.sort === 2
          }).length * 51
        this.$refs.answer.style.height = h
        this.$refs.answer.style.width = 256 + 'px'
        let answerObj = {}
        this.question.options.forEach((o) => {
          if (answerObj.hasOwnProperty(o.serialNumber)) {
            answerObj[o.serialNumber].push(o)
          } else {
            answerObj[o.serialNumber] = [o]
          }
        })
        for (let v in answerObj) {
          let starDom = null
          let endDom = null
          let tempLine = {}
          if (answerObj[v][0].sort === 1) {
            starDom = that.$refs[answerObj[v][0].id][0]
            endDom = that.$refs[answerObj[v][1].id][0]
          } else {
            starDom = that.$refs[answerObj[v][1].id][0]
            endDom = that.$refs[answerObj[v][0].id][0]
          }
          tempLine.y1 = starDom.offsetTop - that.$refs.matchingBox.offsetTop + starDom.offsetHeight / 2
          tempLine.y2 = endDom.offsetTop - that.$refs.matchingBox.offsetTop + endDom.offsetHeight / 2
          that.lines.push(tempLine)
        }
      }, 1000)
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .analy {
    padding-bottom: rem(10);

    &-answer {
      padding: rem(10);
    }

    &-content {
      padding: rem(10);
    }

    &-options {
      padding: 0 rem(10) 0 rem(20);

      div {
        padding: rem(10);
      }

      &-left {
        margin-left: 10px;
      }
    }
  }
</style>
