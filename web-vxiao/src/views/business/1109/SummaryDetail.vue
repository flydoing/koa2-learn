<template>
  <page title="报销详情">
    <Table v-if="table"
           :tableData="table"
           @rowClick="rowClick" />
    <item v-if="summaryType=='waitRecord'"
          @click="handleHistory">
      <div slot="main">历史信息</div>
    </item>
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
        table: {}
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const that = this
        that.summaryType = that.routeParam('type')
        Api.loadExpenseSummaryDetail(that.groupId, that.userId, that.summaryType).then(res => {
          that.table = res.table
        })
      },
      rowClick(row, rowIndex) {
        let ps = row.params
        this.routePush({
          name: 'detail1109',
          query: {
            userId: ps.userId,
            startDate: ps.startDate,
            endDate: ps.endDate
          }
        })
      },
      handleHistory() {
        this.routePush({ name: 'summaryDetail1109', params: { type: 'executedRecord' } })
      }
    },
    watch: {
      '$route.params.type'() {
        this.fetchData()
      }
    }
  }
</script>
