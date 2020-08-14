<template>
  <Page :title="title"
        closePrompt>
    <vx-table v-if="table"
              :data="table.datas"
              :height="maxHeight"
              stripe
              border>
      <template v-if="table.columns">
        <vx-table-column v-for="(item, i) in table.columns"
                         :key="i"
                         :fixed="i===0"
                         :label="item">
          <template slot-scope="scope">
            <div v-html="colTxt(scope.row, i, scope.$index)"></div>
          </template>
        </vx-table-column>
      </template>
    </vx-table>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import ReportApi from '@/views/group/report/api'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        table: null,
        maxHeight: 0
      }
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      }
    },
    created() {
      ReportApi.getRestReportData({
        groupId: this.groupId,
        id: this.routeQuery('msgId'),
        type: '1138'
      }).then(res => {
        this.table = res.table
      })
    },
    methods: {
      colTxt(row, i, rowIndex) {
        let cell = JSON.parse(row.columns[i])
        return cell.value
      }
    },
    watch: {}
  }
</script>
