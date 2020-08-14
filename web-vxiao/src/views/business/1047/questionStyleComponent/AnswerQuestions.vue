<template>
  <!-- 解答题 -->
  <div class="qa">
    <Titleview :title="question.title||question.content"
               :serial="serial"></Titleview>
    <!-- <simpleEditor v-if="routeQuery('pageType')==='studentReply'" :rows="3" placeholder="内容" :tools="['pic']" v-model="inputStr" @getMedias="fromSimpleImage" :noBottom="true" /> -->
    <keep-alive>
      <simpleEditor v-if="routeQuery('pageType')==='studentReply'"
                    placeholder="内容"
                    :toolbars="['photo']"
                    :store.sync="studentAnswer" />
    </keep-alive>
    <item v-if="question.datas && !isAnaly"
          v-for="(data, d) in question.datas"
          :key="d"
          :noborder="true"
          @click="itemClick(data)">
      <div>{{data.key}}</div>
      <div slot="remark">{{data.value}}</div>
    </item>
    <div class="qa-answer"
         v-if="routeQuery('pageType')==='studentReview'">
      <span>答：</span>{{question.options[0].content}}
      <CardImages :images="images"
                  v-if="images.length>0"></CardImages>
    </div>
    <div v-if="!isAnaly && question.options">
      <div class="qa-correct-status"
           v-if="question.options[0].isCorrecting !== '1' && routeQuery('pageType')!=='studentReply'">未批改</div>
      <div class="qa-correct-score"
           v-else-if="question.options[0].isCorrecting === '1' && !routeQuery('pageType')==='studentReview'">
        <div>正确率：</div>
        <div class="correct-range">
          <div v-for="(n, i) in question.options[0].defaultScore"
               :key="i"
               v-if="question.options[0].defaultScore">
            <div :class="{'active':question.options[0].rightRate === n}">{{n}}%</div>
          </div>
        </div>
      </div>
    </div>
    <AnalysisEnter :praxisId="praxisId"
                   :questionId="question.id"
                   :isAnaly="isAnaly"
                   v-if="isTeacher || (!isTeacher && routeQuery('pageType') === 'studentReview')"
                   :quetionData="question" />
    <div class="qa-readCount"
         v-if="showAcountBar()">已答{{question.joinCount}}</div>
  </div>
</template>
<script>
  import Mixin1047 from '../mixin'
  import G from '@/views/group/mixin'
  export default {
    mixins: [Mixin1047, G],
    components: {
      CardImages: resolve => require(['@/views/components/card/ui/Images'], resolve),
      simpleEditor: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
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
        images: [],
        studentAnswer: {
          content: '',
          medias: []
        }
      }
    },
    created() {
      const that = this
      that.question.options &&
        that.question.options.forEach(o => {
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
      that.question.options &&
        that.question.options[0].medias &&
        that.question.options[0].medias.forEach(m => {
          that.images.push({
            thumb: that.url(m.fileId, 'thumb'),
            src: that.url(m.fileId),
            ...m
          })
        })
    },
    methods: {
      itemClick(data) {
        this.routePush({
          name: 'quetionCorrect1047',
          query: {
            praxisId: this.praxisId,
            questionId: this.question.id,
            type: data.type
          }
        })
      }
    },
    watch: {
      'studentAnswer.content'(v) {
        let options = [
          {
            // ...this.question.options,
            content: v,
            medias: this.studentAnswer.medias
          }
        ]
        this.$set(this.question, 'options', options)
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .qa {
    padding: 0 rem(10);
    &-readCount {
      padding-left: rem(10);
      padding-bottom: rem(10);
    }
    &-answer {
      padding-left: rem(10);
      word-wrap: break-word;
      word-break: break-all;
      span {
        color: #999;
      }
    }
    &-correct-status {
      margin: rem(10) 0;
      padding-left: rem(10);
    }
    &-correct-score {
      @include flex;
      @include ai;
      padding-left: rem(10);
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
</style>
