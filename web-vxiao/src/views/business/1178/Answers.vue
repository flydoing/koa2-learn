<template>
  <page title="评估结果">
    <ViewTable v-if="table" :tableData="table" @rowClick="rowClick" />
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import ReportApi from '@/views/group/report/api'
import { mapActions } from 'vuex'

export default {
  mixins: [R],
  components: {
    ViewTable: resolve => require(['@/components/table/Table'], resolve)
  },
  props: {},
  computed: {},
  data() {
    return {
      table: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    ...mapActions(['setTeacherAppraisal']),
    fetchData() {
      const that = this
      let apslId = that.routeQuery('apslId')
      let userId = that.routeQuery('uId')
      let qId = that.routeQuery('qId')
      let oId = that.routeQuery('oId')
      ReportApi.loadReportData({
        appType: '1178',
        fromUserId: this.userId,
        categoryId: apslId,
        userId: userId,
        questionId: qId,
        optionId: oId,
        groupId: this.currentGroup.groupId,
        noTempletReport: 1
      }).then(res => {
        that.table = res.table
      })
    },
    rowClick(row, rIndex) {
      if (row.clickAble) {
        this.setTeacherAppraisal({ remark: row.params.extension, isDetail: true })
        this.routePush({ name: 'addRemark1178' })
      }
    }
  }
}

</script>
