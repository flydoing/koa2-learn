<template>
  <vx-table :data="datas"
            :height="height"
            @row-click="rowClick"
            :rowClassName="rowClass">
    <template v-for="(item,i) in columns">
      <vx-table-column :width="columnWidth(i)"
                       :key="i"
                       :label="item"
                       :fixed="i===0 && columns.length > 4">
        <template slot-scope="scope">
          <span v-html="scope.row.columns[i]"
                :style="prefixStyle(scope.row)"></span>
        </template>
      </vx-table-column>
    </template>
  </vx-table>
</template>
<script>
  export default {
    props: {
      tab: {
        type: Object,
        default: () => {
          return {}
        }
      },
      maxHeight: { type: [String, Number] }
    },
    computed: {
      tableData() {
        return this.tab.table || {}
      },
      datas() {
        return this.tableData.datas || []
      },
      columns() {
        return this.tableData.columns || []
      },
      height() {
        return this.maxHeight
      }
    },
    methods: {
      columnWidth(index) {
        return index < 2 ? 120 : ''
      },
      rowClick(row) {
        this.$emit('click', row, this.tableData.params)
      },
      prefixStyle(row) {
        if (row.color) {
          return { color: row.color }
        }
      },
      rowClass(rowIndex, row) {
        if (row.color === 'gray') {
          return 'gray'
        }
        return ''
      }
    }
  }
</script>
<style lang="scss">
  .vx-table {
    .vx-table--row.gray {
      background: #fafafa;
    }
  }
</style>
