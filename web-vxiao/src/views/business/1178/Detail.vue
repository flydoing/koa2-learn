<template>
  <page :title="title"
        @submit="handleSubmit"
        :hasSubmit="remark!='1'">
    <div class="teacher-apsl-detail">
      <div class="apsl-title"
           v-if="apslCase">标题：{{apslCase.title}}</div>
      <div class="category-title text"></div>
      <div v-for="(question,i) in questions"
           :key="i"
           :question="question">
        <Question :num="i+1"
                  :question="question"
                  :isSummary="remark=='1'"
                  :isAnswer="remark!='1'"
                  @remark="handleAddRemark"
                  @answer="handleAnswer"></Question>
        <div v-if="i+1!=questions.length"
             class="category-title text"></div>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        apslCase: null,
        userData: {},
        questions: []
      }
    },
    created() {
      this.fetchData()
    },
    components: {
      Question: resolve => require(['./Question'], resolve)
    },
    computed: {
      title() {
        return `教师评估 - ${this.userData.name}`
      },
      ...mapGetters({
        appraisal: 'getTeacherAppraisal'
      })
    },
    methods: {
      ...mapActions(['setTeacherAppraisal', 'modifyChannelMessage']),
      fetchData() {
        const that = this
        let uData = that.appraisal.user
        that.apslId = this.routeQuery('apslId')
        that.uId = this.routeQuery('uId')
        that.remark = this.routeQuery('remark')
        that.userData = uData

        if (that.remark !== '1') {
          let apsl = JSON.parse(JSON.stringify(this.appraisal.apslCase))
          that.apslCase = apsl

          if (Check.isRealArray(that.appraisal.questions)) {
            that.questions = JSON.parse(JSON.stringify(that.appraisal.questions))
            let qt = that.appraisal.question || {}
            let rk = that.appraisal.remark
            that.questions = that.questions.map(q => {
              q.remark = qt.id === q.id ? rk : ''
              return q
            })
            that.setTeacherAppraisal({ questions: [], question: null, remark: '' })
          } else {
            let aMap = new Map() // 评估结果
            if (uData && Check.isRealArray(uData.answers)) {
              uData.answers.map(a => {
                aMap.set(a.questionId, a)
              })
            }

            let saMap = new Map() // 自评结果
            if (uData && Check.isRealArray(uData.selfAnswers)) {
              uData.selfAnswers.map(a => {
                saMap.set(a.questionId, a)
              })
            }

            if (apsl && Check.isRealArray(apsl.questions)) {
              that.questions = apsl.questions.map(q => {
                let answer = aMap.get(q.id) || {}
                if (Check.isArray(q.options)) {
                  q.options = q.options.map(o => {
                    if (q.type === '1' || q.type === '4') {
                      o.selected = answer.optionId === o.id
                    } else {
                      o.content = answer.content || ''
                    }
                    return o
                  })
                } else {
                  q.options = [{ content: answer.content || '' }]
                }

                if (!Check.isNullObject(answer)) {
                  q.answer = answer
                }
                if (saMap.get(q.id)) {
                  q.selfAnswer = saMap.get(q.id)
                }
                return { ...q, remark: answer.remark || '' }
              })
            }
          }
        } else {
          Api.loadSummaryDetailData(that.apslId, uData.userId).then(res => {
            that.apslCase = res.project
            that.questions = res.project.questions
          })
        }
      },
      handleAddRemark(qt) {
        this.setTeacherAppraisal({
          questions: this.questions,
          question: qt,
          remark: qt.remark,
          isDetail: false
        })
        this.routePush({ name: 'addRemark1178' })
      },
      handleAnswer(qt, option) {
        this.routePush({
          name: 'apslAnswers1178',
          query: {
            uId: this.userData.userId,
            apslId: this.apslId,
            qId: qt.id,
            oId: option.id
          }
        })
      },
      handleSubmit() {
        const that = this
        let flag = true
        let qs = []
        that.questions.forEach((q, i) => {
          if (q.type === '5') {
            let maxScore = q.options[0].score
            if (maxScore && parseInt(q.options[0].content) > parseInt(maxScore)) {
              that.$message({ message: `(第${i + 1}题）分值不能大于最高分（${maxScore}分）`, type: 'warning' })
              flag = false
              return false
            }
            qs.push({
              id: q.id,
              content: q.options[0].content || 0,
              score: q.options[0].content || 0,
              remark: q.remark
            })
          } else if (q.type === '1' || q.type === '4') {
            q.options.forEach((o, i) => {
              if (o.selected) {
                let op = {
                  id: q.id,
                  optionId: o.id,
                  content: q.options.length < 11 ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(i) : i + 1
                }
                q.type === '4' && (op.score = op.score)
                qs.push(op)
                return false
              }
            })
          } else {
            qs.push({
              id: q.id,
              content: q.options[0].content
            })
          }
        })

        if (!flag) {
          return false
        }

        let postData = {
          participant: {
            questions: qs,
            targetId: that.userData.id,
            userId: that.uId || that.userId
          }
        }
        Api.commitTeacherApslResult(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
          let m = this.appraisal.message
          if (res.remark === '1') {
            m.remark = res.remark
            that.modifyChannelMessage(m)
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .teacher-apsl-detail {
    padding-bottom: rem(8);
    .apsl-title {
      margin: rem(10) 0;
      padding: 0 rem(8);
    }
  }
</style>
