<template>
  <page title="题目详情"
        :hasSubmit="routeQuery('type')==='0'&&options.length>0"
        @submit="commitScore">
    <div class="category-title">习题内容</div>
    <!-- <div :is="getPraxiStyle(praxis.questions[0].type)" :question="praxis.questions[0]" :isAnaly="true" v-if="praxis.questions"></div> -->
    <CommonPraxis :praxisType="getPraxiStyle(praxis.questions[0].type)"
                  :question="praxis.questions[0]"
                  :isAnaly="true"
                  v-if="praxis.questions" />
    <div v-if="routeQuery('type')==='1'">
      <div class="category-title"></div>
      <template v-if="options.length>0">
        <div class="correct"
             v-for="(option, o) in options"
             :key="o">
          <div class="correct-info">
            <img v-lazy="{src:url(option.userAvatar),error:Image.ICO_USER}"
                 alt='头像'>
          </div>
          <div class="correct-main">
            <div class="correct-name">
              {{option.userName}}
              <span>{{option.createTime | ruleTimer}}</span>
            </div>
            <div class="correct-content">{{option.content}}</div>
            <CardImages :images="initImage(option.medias)"
                        v-if="option.medias.length>0" />
            <div class="correct-score">
              <div>正确率：</div>
              <div class="correct-range">
                <template v-if="option.defaultScore">
                  <div v-for="(n, i) in option.defaultScore"
                       :key="i">
                    <div :class="{'active':option.rightRate === n}">{{n}}%</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-else>
      <div class="category-title"></div>
      <template v-if="options.length>0">
        <div class="correct"
             v-for="(option, o) in options"
             :key="o">
          <div class="correct-info">
            <img v-lazy="{src:url(option.userAvatar),error:Image.ICO_USER}"
                 alt='头像'>
          </div>
          <div class="correct-main">
            <div class="correct-name">
              {{option.userName}}
              <span>{{option.createTime | ruleTimer}}</span>
            </div>
            <div class="correct-content">{{option.content}}</div>
            <CardImages :images="initImage(option.medias)"
                        v-if="option.medias.length>0" />
            <div class="correct-score">
              <div>正确率：</div>
              <div class="correct-range">
                <div v-for="n in 5"
                     :key="n"
                     @click="scoreClick(option, n)">
                  <div :class="{'active': option.rightRate === (n-1)*25}">{{(n-1)*25}}%</div>
                </div>
                <div>
                  <input type="text"
                         v-model="option.score"
                         placeholder="自定义"
                         maxlength='2'
                         @keyup="inputChange(option)">
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </page>
</template>
<script>
  import Api from '../api'
  import DateUtils from '@/utils/date'
  import Mixin1047 from '../mixin'
  export default {
    mixins: [Mixin1047],
    components: {
      CardImages: resolve => require(['@/views/components/card/ui/Images'], resolve)
    },
    data() {
      return {
        praxis: {},
        options: []
      }
    },
    created() {
      // type 0=>未批改（可批改） 1=>已批改（不能再次批改）
      const that = this
      Api.getQuestionAnswers(this.routeQuery('praxisId'), this.routeQuery('questionId'), this.routeQuery('type')).then(res => {
        that.praxis = res.praxis
        that.options = res.praxis.questions[0].options || []
        if (that.routeQuery('type') === '1') {
          that.options &&
            that.options.forEach(o => {
              let defaultScore = [0, 25, 50, 75, 100]
              that.$set(o, 'defaultScore', defaultScore)
              if (o.rightRate % 25 !== 0) {
                defaultScore.push(o.rightRate)
                let tempScore = defaultScore.sort((v1, v2) => {
                  return v1 - v2
                })
                that.$set(o, 'defaultScore', tempScore)
              }
            })
        }
      })
    },
    methods: {
      scoreClick(option, n) {
        this.$set(option, 'rightRate', (n - 1) * 25)
      },
      inputChange(option) {
        this.$set(option, 'rightRate', Number(option.score))
        if (option.score % 25 === 0) {
          delete option.score
        }
      },
      commitScore() {
        let students = []
        this.options.forEach(o => {
          students.push({
            userId: o.userId,
            rightRate: o.rightRate
          })
        })
        Api.commitCorrect({
          id: this.routeQuery('praxisId'),
          questions: [
            {
              id: this.praxis.questions[0].id,
              students: students
            }
          ]
        }).then(res => {
          if (res.code === '1') {
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.routeBack()
          }
        })
      },
      initImage(medias) {
        medias.forEach(img => {
          img.thumb = this.url(img.fileId, 'thumb')
          img.url = this.url(img.fileId)
        })
        return medias
      }
    },
    filters: {
      ruleTimer(value) {
        return DateUtils.converFormat(new Date(value))
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .correct {
    padding: 0 rem(10) rem(10);
    margin-top: rem(10);
    @include flex;

    &-info {
      img {
        display: block;
        width: rem(40);
        height: rem(40);
        border-radius: 100%;
      }
    }

    &-main {
      margin-left: rem(8);
      width: rem(600);

      .correct-name {
        @include fc;
        font-size: rem(14);

        span {
          font-size: rem(12);
          color: #9f9f9f;
        }
      }

      .correct-content {
        margin-top: rem(10);
        word-wrap: break-word;
        word-break: break-all;
      }

      .correct-score {
        @include flex;
        @include ai;
        margin-top: rem(10);

        .correct-range {
          width: rem(540);
          @include flex;
          justify-content: space-around;

          & > div {
            width: rem(52);
            height: rem(52);
            border: rem(1) solid #ededed;
            text-align: center;
            line-height: rem(52);
            color: #444;
            border-radius: 100%;
            cursor: pointer;

            &:hover {
              background-color: #ededed;
            }

            input {
              display: block;
              border: none;
              width: 100%;
              line-height: rem(52);
              text-align: center;
              background: none;
              color: #444;
            }

            .active {
              background-color: #2dbe60;
              color: #fff;
              border-radius: 100%;
            }

            div {
              width: rem(52);
              height: rem(52);
            }
          }
        }
      }
    }
  }
</style>
