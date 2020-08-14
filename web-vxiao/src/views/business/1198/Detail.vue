<template>
  <page title="考勤详情">
    <Table v-if="table" :tableData="table" />
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'

export default {
  mixins: [R],
  components: {
    Table: resolve => require(['@/components/table/Table'], resolve)
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
    fetchData() {
      const that = this
      let msgId = that.routeParam('msgId')
      Api.loadAttendanceDetail(msgId, that.currentGroup.groupId, that.userId).then(res => {
        that.table = res.table
      })
    }
  }
}

</script>
