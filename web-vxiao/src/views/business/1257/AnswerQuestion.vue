<template>
  <page title="立即接龙"
        @submit="handleSubmit"
        hasSubmit>
    <div class="questionnaire-detail">
      <div v-for="(question,i) in questionnaire.questions"
           :key="i"
           :question="question">
        <Question :num="i+1"
                  :question="question"
                  :isAnswer="true"
                  :joinIn="false"
                  :display="false"
                  :canDo="true"></Question>
        <div v-if="i+1!=questionnaire.questions.length"
             class="category-title text"></div>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '@/views/business/1042/api'
  import Check from '@/utils/check'
  import MessageApi from '@/api/message'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        questionnaire: {},
        joinIn: false,
        display: false,
        message: null
      }
    },
    created() {
      this.fetchData()
    },
    components: {
      Question: resolve => require(['@/views/business/1042/Question'], resolve)
    },
    computed: {},
    methods: {
      fetchData() {
        const that = this

        let msgId = that.routeQuery('msgId')
        MessageApi.getMessageById(msgId).then(res => {
          this.message = res.message
        })

        Api.loadQuestionnaireData(msgId).then(res => {
          let questions = res.questionnaire.questions.map(q => {
            if (Check.isArray(q.options)) {
              let options = q.options.map(o => {
                o.answerContent = o.answerContent ? o.answerContent : ''
                return o
              })
              q.options = options
            } else {
              q.options = [{ answerContent: '' }]
            }
            return q
          })

          that.questionnaire = res.questionnaire
          that.questionnaire.questions = questions
        })
      },
      handleSubmit() {
        const that = this
        let qt = this.questionnaire.questions[0]

        let opts = qt.options.filter(o => {
          return o.selected
        })
        if (!Check.isRealArray(opts)) {
          this.$message({ message: `至少选择一项`, type: 'warning' })
          return false
        }

        let postData = {
          questionnaire: {
            id: that.questionnaire.id,
            questions: [
              {
                id: qt.id,
                options: opts.map(o => {
                  return { id: o.id, content: `${o.numeralOrder}、${o.content}` }
                })
              }
            ]
          }
        }

        let children = this.baseInfo.user.userDetail.relations
        if (this.isParent && Check.isRealArray(children)) {
          postData.userId = children[0].userId
        }

        Api.commitAnswerData(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.routePushModel({
            name: 'detail1257',
            query: {
              msgId: that.routeQuery('msgId'),
              skip: '1'
            }
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .questionnaire-detail {
    padding-bottom: rem(8);

    .qd-title {
      margin-top: rem(10);
      padding: 0 rem(8) rem(5);
    }

    .question-item:last-child {
      margin-bottom: 0;
    }
  }
</style>
