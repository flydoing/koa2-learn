<template>
  <page :title="titleText">
    <label slot="btn" class="font-Button right" @click="batchComment">一键评价</label>
    <div>
      <student-score-table :initTitles="titles" :initDatas="datas" v-if="datas&&titles"></student-score-table>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    components: {
      StudentScoreTable: resolve => require(['./StudentScoreTable'], resolve)
    },
    data() {
      return {
        titleText: this.routeQuery('subjectName').concat('作业成绩'),
        scoreType: this.getStorage('scoreType', true),
        nullIcon: '/static/ico/icon_commoneuse.png',
        titles: null,
        datas: null
      }
    },
    created() {
      Api.getStudentScoreList(this.currentGroup.groupId, this.routeQuery('msgId'), 1).then(res => {
        if (res && res.code === '1') {
          this.datas = res.homeworkDatas || []
          this.titles = res.titles || []
        }
      })
    },
    methods: {
      ruleDatas(titles, datas) {
        let obj = {}
        obj.titles = titles
        obj.datas = datas
        return obj
      },
      batchComment() {
        this.setStorage('scoreType', this.scoreType)
        this.routePush({
          name: 'batchComment1002',
          query: {
            msgId: this.routeQuery('msgId'),
            subjectName: this.routeQuery('subjectName')
          }
        })
      }
    }
  }

</script>
