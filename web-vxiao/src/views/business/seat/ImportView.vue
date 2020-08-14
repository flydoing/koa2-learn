<template>
  <page title="导入座位表"
        :wth="1024"
        @submit="handleSubmit"
        hasSubmit>
    <div class="import-view">
      <ViewTable :tableData="table">
        <template slot="lock-column">
          <tr class="t-row"
              v-for="(row,i) in table.datas"
              :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true,'error':row.error}"
              :key="i">
            <template v-for="(cell,j) in row.columns">
              <td v-if="j<table.lockColumns"
                  :style="{color:row.color?row.color:'#333'}"
                  class="t-cell"
                  :key="j">
                <template v-if="j==0">
                  <label v-html="cell.content"></label>
                </template>
                <template v-else>
                  <input type="text"
                         class="cell-input"
                         :class="{'error':cell.error}"
                         placeholder="输入内容"
                         v-model="cell.content"
                         @blur="handleColumn($event,i,j)" />
                </template>
              </td>
            </template>
          </tr>
        </template>
        <template slot="content">
          <template v-for="(row,i) in table.datas">
            <tr class="t-row"
                :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true,'error':row.error}"
                :key="i">
              <td :style="{color:row.color?row.color:'#333'}"
                  v-for="(cell,o) in row.columns"
                  :key="o"
                  class="t-cell">
                <template v-if="o==0">
                  <label v-html="cell.content"></label>
                </template>
                <template v-else>
                  <input type="text"
                         class="cell-input"
                         :class="{'error':cell.error}"
                         placeholder="输入内容"
                         v-model="cell.content"
                         @blur="handleColumn($event,i,o)" />
                </template>
              </td>
            </tr>
          </template>
        </template>
      </ViewTable>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import ViewTable from '@/views/business/1237/Table'

  export default {
    mixins: [R],
    data() {
      return {
        table: {
          lockRows: 1,
          lockColumns: 1,
          columns: [],
          datas: []
        },
        tblDatas: []
      }
    },
    components: { ViewTable },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        const that = this
        let tblDatas = this.getStorage('seat_table_import_cache')[0]
        if (Check.isRealArray(tblDatas.data)) {
          let datas = []
          tblDatas.data.forEach((v, i) => {
            let row = [...v]
            if (i === 0) {
              that.table.columns.push('序号', ...row)
            } else {
              let headers = that.table.columns
              if (headers.length < row.length) {
                for (let n = headers.length; n <= row.length; n++) {
                  that.table.columns.push('')
                }
              }
              if (row.length < headers.length) {
                for (let n = row.length; n < headers.length - 1; n++) {
                  row.push('')
                }
              }
              let columns = [{ content: i }]
              row.forEach((j, k) => {
                columns.push({ content: j, error: false })
              })
              that.table.datas.push({ columns: columns, clickAble: false, isSummary: false, error: false })
            }
            datas.push(row)
          })
          that.tblDatas = JSON.parse(JSON.stringify(datas))
        }
      },
      handleColumn(e, rIndex, cIndex) {
        this.$set(this.tblDatas[rIndex + 1], cIndex - 1, e.target.value)
      },
      handleSubmit() {
        Api.checkSeatImportData(this.currentGroup.groupId, JSON.stringify(this.tblDatas)).then(res => {
          if (res.errorDatas) {
            this.$message({ message: res.msg, type: 'error' })

            let rowMap = new Map()
            res.errorDatas.forEach((v, i) => {
              let cols = rowMap.get(v.row)
              if (Check.isRealArray(cols)) {
                cols.push(v.column)
                rowMap.set(v.row, cols)
              } else {
                rowMap.set(v.row, [v.column - 1])
              }
            })

            let datas = []
            this.tblDatas.forEach((v, i) => {
              if (i !== 0) {
                let colMap = new Map()
                let cols = rowMap.get(i)
                if (Check.isRealArray(cols)) {
                  cols.forEach((j, k) => {
                    colMap.set(j, j)
                  })
                }

                let columns = [{ content: i }]
                v.forEach((j, k) => {
                  columns.push({ content: j, error: !Check.isNullString(colMap.get(k)) })
                })
                datas.push({ columns: columns, clickAble: false, isSummary: false, error: Check.isRealArray(cols) })
              }
            })
            this.table.datas = datas
          } else {
            Api.importSeats(this.currentGroup.groupId, JSON.stringify(this.tblDatas)).then(res => {
              this.$message({ message: '操作成功', type: 'success' })
              this.routeBack()
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .import-view {
    .t-row {
      &.error {
        .t-cell {
          background-color: #fbd9d9 !important;
        }
      }
    }
    .cell-input {
      border: none;
      border: rem(1) solid transparent;
      background: transparent;
      &.error {
        color: red;
      }
    }
  }
</style>
