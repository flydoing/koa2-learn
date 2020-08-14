<template>
  <page :title="titleText"
        :hasSubmit="datas && datas.length>0"
        @submit="commitScore">
    <div>
      <div class="category-title text">{{extension}}</div>
      <student-score-table :initDatas="datas"
                           :initTitles="titles"
                           :isEdit="true"
                           v-if="datas&&titles&&(scoreType.value==='1'? scoreTyepChild : true)"
                           :scoreTyepChild="scoreTyepChild"></student-score-table>
    </div>
  </page>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from './api'
  import CategoryEnum from '@/constant/category'
  export default {
    mixins: [CardMixin],
    components: {
      StudentScoreTable: resolve => require(['./StudentScoreTable'], resolve)
    },
    data() {
      return {
        titleText: this.routeQuery('subjectName').concat('作业成绩'),
        extension: '',
        titles: null,
        datas: null,
        scoreTyepChild: [],
        scoreType: this.getStorage('scoreType', true)
      }
    },
    created() {
      Api.getStudentScoreList(this.currentGroup.groupId, this.routeQuery('msgId'), 2).then(res => {
        if (res && res.code === '1') {
          this.titles = res.titles || []
          this.datas = res.homeworkDatas || []
          this.extension = res.extension || ''
          if (this.scoreType.value === '1') {
            // 等级
            let that = this
            Api.getScoreTypeChild(CategoryEnum.SCORESHOW_CHILD, that.scoreType.id, '0').then(res => {
              if (res && res.code === '1') {
                that.scoreTyepChild = res.categorys
                that.datas.forEach(d => {
                  d.gradeName = that.scoreTyepChild[0].name
                  d.score = 100
                  d.optionId = that.scoreTyepChild[0].id
                  d.answerMsgId = d.msgId
                })
              }
            })
          } else {
            this.datas.forEach(item => {
              item.score = 100
              item.answerMsgId = item.msgId
            })
          }
        }
      })
    },
    methods: {
      ruleDatas(titles, datas, isEdit) {
        let obj = {}
        obj.titles = titles
        obj.datas = datas
        obj.isEdit = isEdit
        return obj
      },
      commitScore() {
        let dataArr = []
        let that = this
        that.datas.forEach(data => {
          let obj = {}
          obj.score = data.score
          obj.userId = data.userId
          obj.answerMsgId = data.answerMsgId
          if (data.optionId) {
            obj.optionId = data.optionId
          }
          dataArr.push(obj)
        })
        let reqBody = {
          categoryId: that.scoreType.id,
          datas: dataArr,
          msgId: that.routeQuery('msgId')
        }
        Api.teacherCommitGrade(reqBody).then(res => {
          if (res && res.code === '1') {
            this.routeBack()
          }
        })
      }
    }
  }
</script>
