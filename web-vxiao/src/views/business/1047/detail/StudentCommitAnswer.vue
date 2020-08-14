<template>
  <page title="习题详情"
        hasSubmit
        @submit="commintAnswer">
    <template v-if="praxis.questions">
      <div class="praxis-review-box"
           v-for="(question, q) in praxis.questions"
           :key="q">
        <!-- <div :is="getPraxiStyle(question.type)" :question.sync="question" :serial="q" :praxisId="praxis.id"></div> -->
        <CommonPraxis :praxisType="getPraxiStyle(question.type)"
                      :question.sync="question"
                      :serial="q"
                      :praxisId="praxis.id" />
      </div>
    </template>
  </page>
</template>
<script>
  import Api from '../api'
  import MsgApi from '@/api/message'
  import Mixin1047 from '../mixin'
  import R from '@/views/business/mixin'
  export default {
    mixins: [Mixin1047, R],
    data() {
      return {
        praxis: {}
      }
    },
    created() {
      Api.getTeacherDetail(this.routeQuery('msgId')).then((res) => {
        this.praxis = res.praxis
      })
    },
    methods: {
      commitData(data) {
        MsgApi.modifyMessage(data).then((res) => {
          if (res.code === '1') {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.routeReplace({
              name: 'studentReview1047',
              query: {
                msgId: this.routeQuery('msgId'),
                pageType: 'studentReview'
              }
            })
          }
        })
      },
      commintAnswer() {
        let questionArr = []
        this.praxis.questions.forEach((question) => {
          let obj = {}
          obj.id = question.id
          if (question.type === '13') {
            obj.direction = question.direction
            obj.mergeLogo = question.mergeLogo
          }
          obj.options = []

          if (question.options) {
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
          }

          if (obj.options.length > 0) {
            questionArr.push(obj)
          }
        })

        let postData = {
          id: this.praxis.id,
          msgJson: JSON.stringify({
            fromUserId: this.userId,
            id: this.praxis.id,
            msgId: this.routeQuery('msgId'),
            questions: questionArr
          }),
          groupId: this.currentGroup.groupId,
          msgType: 'submit',
          type: '1047',
          status: '1',
          ...this.commonMessage()
        }
        postData.fromUserName = this.routeQuery('userName')

        let qtCount = this.praxis.questions.length
        if (questionArr.length !== qtCount) {
          this.$confirm(`还有${qtCount - questionArr.length}题未答，是否继续作答？`, '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          })
            .then(() => {})
            .catch(() => {
              this.commitData(postData)
            })
        } else {
          this.commitData(postData)
        }
      }
    }
  }
</script>
