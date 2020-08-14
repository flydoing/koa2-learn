<template>
  <div>
    <div v-if="isShowResultOutside"
         class="result-outside">
      <div class='sign-success'>
        <img :src='icoSuccess' />
        <div>提交成功!</div>
      </div>
    </div>
    <page :title="title"
          v-if="!isShowResultOutside && reloadPage"
          @submit="handleSubmit"
          :hasSubmit="!joinIn">
      <label v-if="canExport"
             slot="btn"
             @click="handleExport">导出</label>
      <template v-if="joinIn">
        <span slot="btn">
          <img class="btn-chart"
               v-lazy="{src:chartIcon}"
               @click="showChart = !showChart" />
        </span>
      </template>
      <div class="questionnaire-detail">
        <div class="qd-title"
             v-html="qtrTitle"></div>
        <div class="qd-explain"
             v-if="questionnaire.explain">说明：{{questionnaire.explain}}</div>
        <div class="category-title text"></div>
        <div v-for="(question,i) in questionnaire.questions"
             :key="i"
             :question="question">
          <Question :num="i+1"
                    :question="question"
                    :isAnswer="true"
                    :joinIn="joinIn"
                    :upperLimit="upperLimit"
                    :display="(isAdmin && joinIn) || display"
                    :canDo="!joinIn">
            <template slot="name"
                      v-if="appType === '1007'"></template>
            <template v-if="showChart && (question.type==='1' || question.type==='2' || question.type==='3') && joinIn">
              <Chart :type="getChatType(question.type)"
                     :chart="getChatData(question)"
                     :questionId="question.id"></Chart>
            </template>
          </Question>
          <div v-if="i+1!=questionnaire.questions.length"
               class="category-title text"></div>
        </div>
      </div>
      <div class="commin-btn"
           v-if="!isWeb">
        <button @click="handleSubmit">提交</button>
      </div>
    </page>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import MessageApi from '@/api/message'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        questionnaire: {
          explain: ''
        },
        joinIn: false,
        display: false,
        message: null,
        showChart: false,
        isShowResultOutside: false,
        icoSuccess: `/static/ico/ico_success.png`,
        reloadPage: false
      }
    },
    created() {
      this.fetchData()
    },
    components: {
      Question: resolve => require(['./Question'], resolve),
      // Question: (resolve) => require(['@/views/business/1042/Question'], resolve),
      Chart: resolve => require(['@/views/business/1260/Chart'], resolve)
    },
    computed: {
      isWeb() {
        if (/android/i.test(navigator.userAgent)) {
          return false
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
          return false
        }
        return true
      },
      title() {
        return this.routeQuery('title')
      },
      appType() {
        return this.routeQuery('appType')
      },
      qtrTitle() {
        let qtr = this.questionnaire
        if (qtr) {
          if (this.appType === '1007') {
            return qtr.questions ? `标题：${qtr.questions[0].title}` : ''
          }
          return `标题：${this.questionnaire.title}`
        }
        return ''
      },
      canExport() {
        if (!this.joinIn) {
          return false
        } else {
          if (this.message) {
            let identity = this.isAdmin || this.isAppAdmin(this.message.type) || this.message.fromUserId === this.userId
            return identity && this.joinIn
          }
          return false
        }
        // if (this.message) {
        //   let identity = this.isAdmin || this.isAppAdmin(this.message.type) || this.message.fromUserId === this.userId
        //   return identity && this.joinIn
        // }
        // return false
      },
      chartIcon() {
        return this.showChart ? '/static/ico/ico_chart_press.png' : '/static/ico/ico_chart.png'
      }
    },
    methods: {
      ...mapActions(['modifyChannelMessage']),
      getChatType(value) {
        if (value === '1') {
          return 'pie'
        }
        if (value === '2') {
          return 'bar'
        }
        return value === '3' ? 'cloud' : 'radar'
      },
      getChatData(qt) {
        let joinFlag = false
        if (Check.isRealArray(qt.options)) {
          let ops = qt.options.filter(v => {
            return v.joinCount > 0
          })
          joinFlag = ops.length > 0
        }
        if (qt.type === '1') {
          if (joinFlag) {
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
        } else if (qt.type === '2') {
          if (joinFlag) {
            let keys = []
            let values = []
            qt.options.forEach((v, i) => {
              keys.push(`ABCDEFGHIJKLMNOPQRSTUVWXYZ`.charAt(i))
              values.push(v.joinCount)
            })
            return { keys: keys, values: values }
          }
          return { keys: ['无数据'], values: [100] }
        } else if (qt.type === '3') {
          return qt
        }
      },
      fetchData() {
        const that = this
        let msgId = that.routeParam('msgId')
        if (!msgId) {
          return
        }

        MessageApi.getMessageById(msgId).then(res => {
          this.message = res.message
        })

        let joinIn = this.routeQuery('joinIn')
        Api.loadQuestionnaireData(msgId).then(res => {
          if (!res) {
            that.$message({ message: `出错了...`, type: 'error' })
          }
          this.reloadPage = true
          let questions = res.questionnaire.questions.map(q => {
            if (Check.isArray(q.options)) {
              let options = q.options.map(o => {
                o.answerContent = q.score ? q.score : ''
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
          if (joinIn !== undefined) {
            that.joinIn = parseInt(joinIn) === 1
          } else {
            that.joinIn = that.questionnaire.joinFlag
          }

          that.display = that.questionnaire.display
          if (!joinIn) {
            document.title = `问卷:${that.questionnaire.title}`
          }
        })
        that.upperLimit = that.routeQuery('upperLimit')
      },
      handleExport() {
        if (this.message.type === '1042') {
          this.openBrowser(`/business/questionnaire/downloadQuestionnaire/${this.message.id}/${this.userId}`)
        } else {
          this.openBrowser(`/business/questionnaire/downloadVoting/${this.message.id}/${this.userId}`)
        }
      },
      handleSubmit() {
        const that = this

        let questions = that.checkQuestions()
        if (!questions) {
          return false
        }

        Api.commitAnswerData({
          questionnaire: {
            id: that.questionnaire.id,
            questions: questions
          }
        }).then(res => {
          if (!this.isWeb) {
            that.isShowResultOutside = true
          } else {
            that.message.readed = 1
            that.modifyChannelMessage(that.message)
            that.routeBack()
          }
        })
      },
      checkQuestions() {
        let questions = []
        let warning = ''
        let txt = ''
        this.questionnaire.questions.forEach((q, i) => {
          txt = `（第${i + 1}题）`
          if (q.type === '1' || q.type === '2') {
            let opts = q.options.filter(o => {
              return o.selected
            })
            if (!Check.isRealArray(opts)) {
              warning = `至少选择一项`
              return false
            }

            questions.push({
              id: q.id,
              options: opts.map(o => {
                return { id: o.id }
              })
            })
          } else if (q.type === '3') {
            let content = q.options[0].answerContent
            if (Check.isNullString(content)) {
              warning = `请输入答案`
              return false
            }
            questions.push({
              id: q.id,
              options: [{ id: q.options[0].id, content: content }]
            })
          } else if (q.type === '4') {
            let content = q.options[0].answerContent
            if (Check.isNullString(content)) {
              warning = `请输入统计值`
              return false
            }
            if (parseInt(content) < q.options[0].startValue || parseInt(content) > q.options[0].endValue) {
              warning = `请输入${q.options[0].startValue}~${q.options[0].endValue}的数值`
              return false
            }
            let contentNum = q.options[0].answerContent
            if (!/^[0-9]\d*(?:\.\d{1,2}|\d*)$/.test(contentNum)) {
              warning = `数字格式不对：统计题只能输入数字、小数点`
              return false
            }
            questions.push({
              id: q.id,
              options: [{ id: q.options[0].id, content: content }]
            })
          } else {
            let content = q.options[0].answerContent
            if (Check.isNullString(content)) {
              warning = `至少选择一个分数`
              return false
            }
            questions.push({
              id: q.id,
              options: [{ id: q.options[0].id, content: content }]
            })
          }
        })

        if (Check.isNullString(warning)) {
          return questions
        }

        this.$message({ message: `${warning}${txt}`, type: 'warning' })
        return false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .result-outside {
    .sign-success {
      text-align: center;
      padding-top: 50px;
      img {
        display: inline-block;
        margin-bottom: rem(15);
      }
    }
  }
  .btn-chart {
    width: rem(25);
    height: rem(25);
    cursor: pointer;
    margin-left: rem(10);
  }
  .questionnaire-detail {
    padding-bottom: rem(8);

    .qd-title {
      margin-top: rem(10);
      padding: 0 rem(8) rem(5);
    }

    .qd-explain {
      padding: 0 rem(8) rem(10);
      text-align: justify;
    }

    .question-item:last-child {
      margin-bottom: 0;
    }
  }
  .commin-btn {
    @include flex;
    button {
      @include bc;
      display: block;
      width: rem(250);
      height: rem(40);
      margin: rem(30) auto;
      line-height: rem(40);
      font-size: rem(14);
      color: nth($font-color, 4);
      border-radius: rem(3);
      cursor: pointer;
      border: none;
      outline: none;
      &:hover {
        @include bch;
      }
    }
  }
</style>
