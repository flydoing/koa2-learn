<template>
  <page title="阅读详情"
        hasSubmit
        @submit="readCommit">
    <div class="read-detail">
      <div class="category-title"></div>
      <div class="read-title"
           v-html="praxis.title"></div>
      <div class="read-content"
           v-html="praxis.content"
           @click="ProxyClickSpan($event)"></div>
      <div class="category-title"></div>
      <div class="praxis-list">
        <!-- <div :is="getPraxiStyle(question.type)" class="praxis" v-if="questions.length>0" v-for="(question, q) in questions" :key="q" :question="question" :serial="q" :praxisId="praxis.id"></div> -->
        <template v-if="questions.length > 0">
          <CommonPraxis :praxisType="getPraxiStyle(question.type)"
                        class="praxis"
                        v-for="(question, q) in questions"
                        :key="q"
                        :question="question"
                        :serial="q"
                        :praxisId="praxis.id" />
        </template>
      </div>
    </div>
  </page>
</template>
<script>
  import Mixin1047 from '@/views/business/1047/mixin'
  import PraxisApi from '@/views/business/1047/api'
  import MsgApi from '@/api/message'
  import R from '@/views/business/mixin'
  export default {
    mixins: [Mixin1047, R],
    data() {
      return {
        praxis: {},
        questions: [],
        annotationContent: null
      }
    },
    created() {
      PraxisApi.getTeacherDetail(this.routeQuery('msgId'))
        .then(res => {
          this.praxis = res.praxis
          this.questions = res.praxis.questions
        })
        .catch(res => {})
    },
    methods: {
      ProxyClickSpan(event) {
        if (event.target.nodeName === 'SPAN') {
          let k = event.target.getAttribute('k')
          this.routePush({
            name: 'annotation1069',
            query: {
              msgId: this.routeQuery('msgId'),
              k: k
            }
          })
        }
      },
      readCommit() {
        let questionArr = []
        this.praxis.questions.forEach(question => {
          let obj = {}
          obj.id = question.id
          if (question.type === '13') {
            obj.direction = question.direction
            obj.mergeLogo = question.mergeLogo
          }
          obj.options = []
          question.options.forEach((option, k) => {
            // 单选、多选题、判断
            if (question.type === '6' || question.type === '7' || question.type === '14') {
              option.selected &&
                obj.options.push({
                  id: option.id
                })
            } else if (question.type === '12') {
              // 填空题
              obj.options.push({
                id: option.id,
                content: option.content
              })
            } else if (question.type === '8') {
              // 解答题
              obj.options.push({
                id: option.id,
                content: option.content,
                medias: [...option.medias]
              })
            } else if (question.type === '17') {
              // 文字排序
              obj.options.push({
                id: option.id,
                sort: k + 1
              })
            } else if (question.type === '13') {
              // 图片排序
              obj.options.push({
                id: option.id,
                sort: k + 1,
                medias: [...option.medias]
              })
            } else if (question.type === '16') {
              option = [...question.studentAanswers]
              obj.options = [...option]
            }
          })
          questionArr.push(obj)
        })
        let msgJson = {
          fromUserId: this.userId,
          id: this.praxis.id,
          msgId: this.routeQuery('msgId'),
          questions: questionArr
        }
        let reqbody = {
          id: this.praxis.id,
          msgJson: JSON.stringify(msgJson),
          groupId: this.currentGroup.groupId,
          msgType: 'submit',
          type: '1069',
          status: '1',
          ...this.commonMessage()
        }
        reqbody.fromUserName = this.routeQuery('userName')
        MsgApi.modifyMessage(reqbody).then(res => {
          if (res.code === '1') {
            this.$message({
              type: 'success',
              message: '成功！'
            })
            this.routeReplace({
              name: 'studentReview1069',
              query: {
                msgId: this.routeQuery('msgId'),
                pageType: 'studentReview'
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .read-detail {
    .read-title {
      font-size: rem(16);
      padding: rem(10);
      border-bottom: rem(1) solid #ededed;
      background-color: #fff;
    }
    .read-content {
      padding: rem(10);
      .postil {
        @include fc;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .praxis-list {
      background-color: #ededed;
      .praxis {
        margin-bottom: rem(10);
        background-color: #fff;
      }
    }
  }
</style>
