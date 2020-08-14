<template>
  <page title="联考">
    <div slot="top"
         v-if="this.tableData.title"
         class="table-title"
         v-html="this.tableData.title"></div>
    <vx-table :data="tableData.datas"
              :height="maxHeight"
              @row-click="rowClick"
              stripe>
      <vx-table-column width="120"
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
  import DetailApi from './detailApi'
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
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        DetailApi.getMessageReport(this.groupId, this.routeQuery('msgId')).then(res => {
          if (res.table) {
            this.tableData = res.table
          }
        })
      },
      rowClick(row) {
        if (row.clickAble == null || row.clickAble === true) {
          this.routePush({
            name: 'report1123',
            params: {
              groupId: row.params.groupId
            },
            query: {
              ...row.params
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .table-title {
    @include ct;
    line-height: rem(40);
    border-bottom: $border;
  }
</style>
