<template>
  <vx-table :data="tableData.rows"
            :height="maxHeight"
            @row-click="rowClick"
            stripe>
    <vx-table-column width="120"
                     v-for="(item,i) in tableData.headers"
                     :label="item"
                     :key="i"
                     :fixed="i===0 && tableData.headers.length > 4">
      <template slot-scope="scope">
        <span v-html="scope.row.columns[i]"></span>
      </template>
    </vx-table-column>
  </vx-table>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        tableData: {},
        maxHeight: 200
      }
    },
    created() {
      Api.loadOrderReport(this.routeParam('groupId')).then(res => {
        if (res.table) {
          this.tableData = res.table
        }
      })
    },
    methods: {
      rowClick(r) {}
    }
  }
</script>
