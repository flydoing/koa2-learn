<template>
  <page title="已选题目"
        hasSubmit
        @submit="handleSubmit"
        listenBack
        @back="back">
    <div class="questions-preview">
      <div v-if="questions.length>0"
           v-for="(q, i) in questions"
           :key="i">
        <QuetionCard :quetion="q"
                     :serail="i"
                     @deleteQuestion="deleteQuestion(i)"
                     @analysis="handleAnalysis" />
      </div>
    </div>
    <div class="list-button"
         slot="bottom">
      <div class="button"
           @click="addAgain">继续添加</div>
    </div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    components: {
      QuetionCard: (resolve) => require(['./QuetionCard'], resolve)
    },
    data() {
      return {
        questions: []
      }
    },
    computed: {
      ...mapGetters({
        cacheClassRoom: 'getClassRoomCreate'
      })
    },
    created() {
      this.questions = JSON.parse(JSON.stringify(this.cacheClassRoom.previewQuetions))
    },
    methods: {
      ...mapActions(['saveClassRoomCreate']),
      handleSubmit() {
        if (this.questions.length === 0) {
          this.$message({
            type: 'warning',
            message: '题目数量不能为0'
          })
          return false
        }
        let m = {
          businessName: '习题',
          content: this.getContent(this.questions),
          title: this.routeQuery('categoryName'),
          groupId: this.routeQuery('groupId'),
          extensionType: JSON.stringify({
            questions: this.questions
          }),
          type: '1047',
          ...this.constructionMessage()
        }
        if (Number(this.routeQuery('msgType')) === 1) {
          this.saveClassRoomCreate({
            classBefore: [...this.cacheClassRoom.classBefore, m],
            previewQuetions: []
          })
        } else if (Number(this.routeQuery('msgType')) === 2) {
          this.questions.forEach((q) => {
            q.remark = '1047'
          })
          this.saveClassRoomCreate({
            classLesson: [...this.cacheClassRoom.classLesson, ...this.questions],
            previewQuetions: []
          })
        } else if (Number(this.routeQuery('msgType')) === 3) {
          this.saveClassRoomCreate({
            classAfter: [...this.cacheClassRoom.classAfter, m],
            previewQuetions: []
          })
        }
        this.$router.go(-4)
        // this.routeReplace({
        //   path: '/create/default',
        //   query: {
        //     appType: '1073',
        //     groupId: this.currentGroup.groupId
        //   }
        // })
      },
      deleteQuestion(i) {
        this.questions.splice(i, 1)
      },
      handleAnalysis(question) {
        this.setStorage('question', question)
        this.routePush({ name: 'praxiAnaly1047' })
      },
      back() {
        this.saveClassRoomCreate({
          previewQuetions: this.questions
        })
        this.routeBack()
      },
      getContent(questions) {
        // 6单选题 7多选题 8解答题 12填空题 14判断题 16连线题
        let sCount = 0
        let dCount = 0
        let wCount = 0
        let fCount = 0
        let jCount = 0
        let xCount = 0
        questions.forEach((question) => {
          switch (question.type) {
            case '6':
              sCount++
              break
            case '7':
              dCount++
              break
            case '8':
              wCount++
              break
            case '12':
              fCount++
              break
            case '14':
              jCount++
              break
            case '16':
              xCount++
              break
          }
        })
        let arr = []
        sCount > 0 && arr.push(`${this.getType('6')}${sCount}题`)
        dCount > 0 && arr.push(`${this.getType('7')}${dCount}题`)
        wCount > 0 && arr.push(`${this.getType('8')}${wCount}题`)
        fCount > 0 && arr.push(`${this.getType('12')}${fCount}题`)
        jCount > 0 && arr.push(`${this.getType('14')}${jCount}题`)
        xCount > 0 && arr.push(`${this.getType('16')}${xCount}题`)
        return `共${questions.length}题：${arr.join(',')}`
      },
      getType(type) {
        switch (type) {
          case '6':
            return '单选'
          case '7':
            return '多选'
          case '8':
            return '解答'
          case '9':
            return '填空'
          case '12':
            return '填空'
          case '13':
            return '排序'
          case '14':
            return '判断'
          case '15':
            return '综合'
          case '16':
            return '连线'
          case '17':
            return '文字排序'
          default:
            return ''
        }
      },
      addAgain() {
        // this.routePush({
        //   name: 'classRoomCatalogues1073',
        //   query: {
        //     range: this.routeQuery('range'),
        //     groupId: this.routeQuery('groupId'),
        //     appName: this.routeQuery('appName'),
        //     type: '1047',
        //     msgType: this.routeQuery('msgType')
        //   }
        // })
        this.routeBack(-2)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .questions-preview {
    background-color: #ededed;
    & > div {
      background: #fff;
      margin-bottom: rem(10);
    }
  }
</style>
