<template>
  <page :title="title"
        @submit="handleSubmit"
        :hasSubmit="hasSubmit">
    <template v-if="joinIn"
              slot="btn">
      <img class="btn-chart"
           v-lazy="{src:chartIcon}"
           @click="showChart = !showChart" />
    </template>
    <div class="feedback">
      <div v-for="(question,i) in questionnaire.questions"
           :key="i"
           :question="question">
        <Question :num="i+1"
                  :question="question"
                  :isAnswer="isParent || !joinIn"
                  :joinIn="joinIn"
                  :display="joinIn"
                  :canDo="hasSubmit"
                  @click="handleQuestion"
                  @location="handleLocation">
          <template v-if="isTeacher && (question.type==='1' || question.type==='2') && joinIn">
            <Chart v-if="showChart"
                   :type="getChatType(question.chartType)"
                   :chart="getChatData(question)"></Chart>
          </template>
        </Question>
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
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        questionnaire: {},
        showChart: false
      }
    },
    created() {
      this.fetchData()
    },
    components: {
      Question: resolve => require(['@/views/business/1042/Question'], resolve),
      Chart: resolve => require(['./Chart'], resolve)
    },
    computed: {
      ...mapGetters({
        visit: 'getHomeVisit'
      }),
      title() {
        let record = this.visit.record
        return record ? `反馈问卷 - ${record.name}` : '反馈问卷'
      },
      hasSubmit() {
        let message = this.visit.message || {}
        return message.readed === 0
      },
      joinIn() {
        let record = this.visit.record || {}
        return this.isTeacher && record.haveFeedback === undefined
      },
      chartIcon() {
        return this.showChart ? '/static/ico/ico_chart_press.png' : '/static/ico/ico_chart.png'
      }
    },
    methods: {
      ...mapActions(['setHomeVisit', 'deleteHomeVisitProp', 'modifyChannelMessage']),
      getChatType(value) {
        if (value === '1') {
          return 'pie'
        }
        return value === '2' ? 'bar' : 'radar'
      },
      getChatData(qt) {
        if (qt.chartType === '1') {
          if (qt.participanCount > 0) {
            let keys = []
            let datas = []
            qt.options.forEach((v, i) => {
              let sort = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.charAt(i)
              keys.push(sort)
              datas.push({ name: sort, value: v.joinCount })
            })
            return { keys: keys, datas: datas }
          }
          return { keys: ['无数据'], datas: [{ name: '无数据', value: 100 }] }
        } else if (qt.chartType === '2') {
          if (qt.participanCount > 0) {
            let keys = []
            let values = []
            qt.options.forEach((v, i) => {
              keys.push(`ABCDEFGHIJKLMNOPQRSTUVWXYZ`.charAt(i))
              values.push(v.joinCount)
            })
            return { keys: keys, values: values }
          }
          return { keys: ['无数据'], values: [100] }
        } else if (qt.chartType === '3') {
          let datas = []
          let values = []
          if (qt.participanCount > 0) {
            qt.options.forEach((v, i) => {
              let sort = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.charAt(i)
              values.push(v.percent)
              datas.push({ text: sort, max: 100 })
            })
            return { values: values, datas: datas }
          }
          qt.options.forEach((v, i) => {
            let sort = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.charAt(i)
            values.push(0)
            datas.push({ text: sort, max: 100 })
          })
          return { values: values, datas: datas }
        }
      },
      fetchData() {
        const that = this
        if (that.visit.showChart) {
          that.showChart = that.visit.showChart
          that.deleteHomeVisitProp('showChart')
        }
        if (that.visit.questionnaire) {
          that.questionnaire = JSON.parse(JSON.stringify(that.visit.questionnaire))
          let index = that.visit.qtIndex
          let address = that.visit.address
          if (index !== -1 && address) {
            let qt = that.questionnaire.questions[index]
            that.$set(that.questionnaire.questions, index, { ...qt, options: [{ answerContent: JSON.stringify(address) }] })
          }
          that.deleteHomeVisitProp('questionnaire')
          that.deleteHomeVisitProp('qtIndex')
          that.deleteHomeVisitProp('address')
        } else {
          let msgId = that.routeQuery('msgId')
          let userId = that.userId
          if (that.visit.record) {
            userId = that.visit.record.userId
          }
          Api.loadQuestionnaireData(msgId, userId).then(res => {
            let questions = res.questionnaire.questions.map(q => {
              if (Check.isArray(q.options)) {
                let options = q.options.map(o => {
                  if (q.type === '3' || q.type === '19') {
                    o.answerContent = o.content || ''
                  } else {
                    o.answerContent = q.score ? q.score : ''
                  }
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
        }
      },
      handleQuestion(qt, num) {
        let message = this.visit.message || {}
        if (qt.chartType === '4' && message.readed === 0) {
          this.setHomeVisit({ questionnaire: this.questionnaire, qtIndex: parseInt(num) - 1 })
          if (qt.options[0].answerContent) {
            this.setHomeVisit({ address: JSON.parse(qt.options[0].answerContent) })
          }
          this.routePush({ name: 'selectAddress1260' })
        } else if (qt.chartType === '4' && message.readed !== 0 && !this.joinIn && !Check.isNullString(qt.options[0].content)) {
          this.routePush({
            name: 'locationDetail1260',
            query: {
              qId: qt.id,
              msgId: this.routeQuery('msgId'),
              userId: this.visit.record ? this.visit.record.userId : this.userId
            }
          })
        }
      },
      handleLocation(qt) {
        this.setHomeVisit({ showChart: this.showChart })
        this.routePush({
          name: 'locationDetail1260',
          query: {
            qId: qt.id,
            msgId: this.routeQuery('msgId')
          }
        })
      },
      handleSubmit() {
        const that = this

        let questions = that.checkQuestions()
        if (!questions) {
          return false
        }
        Api.commitAnswerData({
          userId: that.userId,
          questionnaire: {
            id: that.questionnaire.id,
            questions: questions
          }
        }).then(res => {
          that.modifyChannelMessage({ ...this.visit.message, readed: 1 })
          that.deleteHomeVisitProp('message')
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      checkQuestions() {
        let flag = true
        let warning = ''
        let count = 0

        let questions = []
        this.questionnaire.questions.forEach((q, i) => {
          if (flag) {
            warning = `（第${i + 1}题）`
          }
          if (q.type === '1' || q.type === '2') {
            let opts = q.options.filter(o => {
              return o.selected
            })
            if (Check.isRealArray(opts)) {
              questions.push({
                id: q.id,
                options: opts.map(o => {
                  return { id: o.id }
                })
              })
            } else {
              count++
            }
          } else if (q.type === '3') {
            let content = q.options[0].answerContent
            if (!Check.isNullString(content)) {
              questions.push({
                id: q.id,
                options: [{ id: q.options[0].id, content: content }]
              })
            } else {
              count++
            }
          } else if (q.type === '4') {
            let content = q.options[0].answerContent
            if (!Check.isNullString(content)) {
              questions.push({
                id: q.id,
                options: [{ id: q.options[0].id, content: content }]
              })
            } else {
              count++
            }
            if (parseInt(content) < q.options[0].startValue || parseInt(content) > q.options[0].endValue) {
              warning = `请输入${q.options[0].startValue}~${q.options[0].endValue}的数值${warning}`
              flag = false
              return false
            }
          } else if (q.type === '19') {
            let content = q.options[0].answerContent
            if (!Check.isNullString(content)) {
              questions.push({
                id: q.id,
                options: [{ id: q.options[0].id, content: content }]
              })
            } else {
              count++
            }
          } else {
            let content = q.options[0].answerContent
            if (!Check.isNullString(content)) {
              questions.push({
                id: q.id,
                options: [{ id: q.options[0].id, content: content }]
              })
            } else {
              count++
            }
          }
        })

        if (count !== 0) {
          this.$message({ message: `还有${count}题未答，请答完后再提交`, type: 'warning' })
          return false
        } else if (flag) {
          return questions
        }
        this.$message({ message: warning, type: 'warning' })
        return false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .btn-chart {
    margin-top: rem(7.5) !important;
    width: rem(25);
    height: rem(25);
    cursor: pointer;
  }
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
