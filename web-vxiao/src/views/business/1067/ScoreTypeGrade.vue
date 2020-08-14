<template>
  <page title="等级">
    <item v-for="(grade, g) in scoreTyepChild" :key="g" @click="gradeHandle(grade)">
      <div slot="main">{{grade.name}}</div>
      <span slot="after"></span>
    </item>
  </page>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from './api'
  export default {
    mixins: [CardMixin],
    data() {
      return {
        scoreTyepChild: []
      }
    },
    created() {
      this.scoreTyepChild = this.getStorage('scoreTyepChild')
    },
    methods: {
      gradeHandle(grade) {
        this.commitGrading(grade)
      },
      commitGrading(grade, scoreText = null) {
        let that = this
        let reqBody = {
          homeworks: [{
            msgId: that.routeQuery('parentId'),
            categoryId: that.routeQuery('categoryId'),
            datas: [{
              optionId: !scoreText ? grade.id : void 0,
              score: scoreText || grade.value,
              userId: that.userId,
              answerMsgId: that.routeQuery('msgId')
            }]
          }]
        }
        Api.grading(reqBody).then(res => {
          if (res && res.code === '1') {
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.routeBack()
          }
        })
      }
    }
  }

</script>
