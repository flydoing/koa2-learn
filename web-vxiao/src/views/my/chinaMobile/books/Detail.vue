<template>
  <Page title="图书"
        ref="_page">
    <vx-table :data="tableData.datas"
              :height="maxHeight"
              stripe>
      <vx-table-column v-for="(item,j) in tableData.columns"
                       :label="item"
                       :key="j"
                       :fixed="j===0 && tableData.columns.length > 4">
        <template slot-scope="scope">
          <span v-html="scope.row.columns[j]"></span>
        </template>
      </vx-table-column>
    </vx-table>
  </Page>
</template>
<script>
  import Api from '../../api'
  export default {
    components: {},
    data() {
      return {
        tableData: {
          columns: [],
          datas: []
        },
        maxHeight: 0
      }
    },
    mounted() {
      Api.loadBooksTable({ ...this.$route.query }).then(res => {
        this.tableData = res.table
      })
    }
  }
</script>
