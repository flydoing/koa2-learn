<template>
  <page :title="title">
    <vx-table :data="tableData.datas"
              :height="maxHeight"
              stripe>
      <vx-table-column min-width="120"
                       v-for="(item,j) in tableData.columns"
                       :label="item"
                       :key="j"
                       :fixed="j===0 && tableData.columns.length > 4">
        <template slot-scope="scope">
          <span v-html="scope.row.columns[j]"></span>
        </template>
      </vx-table-column>
    </vx-table>
  </page>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        tableData: {},
        maxHeight: 200
      }
    },
    computed: {
      title() {
        return this.routeQuery('appType') === '115006' ? '入库详情' : '报废详情'
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        Api.getMessageReport(this.routeQuery('appType'), this.groupId, this.routeQuery('msgId')).then((res) => {
          if (res.table) {
            this.tableData = res.table
          }
        })
      }
    }
  }
</script>
