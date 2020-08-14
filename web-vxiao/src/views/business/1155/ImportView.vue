<template>
  <page title="导入报告"
        ref="_page"
        hasSubmit
        @submit="handleSubmit"
        closePrompt>
    <div class="import-view">
      <vx-table v-if="rowDatas"
                :data="rowDatas"
                :height="maxHeight"
                stripe
                :rowClassName="rowClass">
        <template v-if="table.columns">
          <vx-table-column width="120"
                           v-for="(item, i) in table.columns"
                           :label="item"
                           :key="i"
                           :fixed="i<4 && table.columns.length > 9">
            <template slot-scope="scope">
              <label :class="{'error':scope.row.columns[i].error}"
                     v-html="scope.row.columns[i].content"></label>
            </template>
          </vx-table-column>
        </template>
      </vx-table>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  import MixinMessage from '@/views/group/mixinMessage'
  import DateUtils from '@/utils/date'

  export default {
    mixins: [R, MixinMessage],
    data() {
      return {
        table: null,
        tblDatas: [],
        maxHeight: 0
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        physicalExam: 'getPhysicalExam'
      }),
      rowDatas() {
        let table = this.table || {}
        if (Check.isRealArray(table.datas)) {
          let datas = []
          datas = table.datas.filter((v, i) => {
            v.rowIndex = i
            return v.error
          })
          return datas.length > 0 ? datas : table.datas
        }
        return false
      }
    },
    methods: {
      ...mapActions(['setPhysicalExam']),
      rowClass(rowIndex, row) {
        if (row.error) {
          return 'error'
        }
        return ''
      },
      fetchData() {
        const that = this
        let tableDatas = that.physicalExam.dataGrids[0].data
        let table = { columns: [], datas: [] }
        if (Check.isRealArray(tableDatas)) {
          let datas = []
          tableDatas.forEach((v, i) => {
            let row = [...v]
            if (i === 0) {
              table.columns.push('序号', ...row)
            } else {
              let headers = table.columns
              if (headers.length < row.length) {
                for (let n = headers.length; n <= row.length; n++) {
                  table.columns.push('')
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
              table.datas.push({ columns: columns, error: false })
            }
            datas.push(row)
          })
          that.tblDatas = JSON.parse(JSON.stringify(datas))
          that.table = table
        }
      },
      handleColumn(e, rIndex, cIndex) {
        const that = this
        let data = that.tblDatas[rIndex + 1][cIndex - 1]
        this.$prompt(' ', '编辑', {
          inputPlaceholder: '输入内容',
          inputValue: data,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            that.$message({ message: '内容不能为空', type: 'warning' })
            return false
          }
          that.$set(that.tblDatas[rIndex + 1], cIndex - 1, value)
          that.$set(that.table.datas[rIndex], 'error', false)
          that.$set(that.table.datas[rIndex].columns, cIndex, { content: value, error: false })
        })
      },
      handleSubmit() {
        const that = this
        let date = this.physicalExam.date
        Api.importReportData(this.currentGroup.parentId, {
          date: DateUtils.format_0800(date),
          dataJson: JSON.stringify(this.tblDatas),
          schoolId: this.currentGroup.parentId
        }).then(res => {
          if (res.errorDatas) {
            that.$message({ message: res.msg, type: 'error' })
            let rowMap = new Map()
            res.errorDatas.forEach((v, i) => {
              let cols = rowMap.get(v.row)
              if (Check.isRealArray(cols)) {
                cols.push(v.column)
                rowMap.set(v.row, cols)
              } else {
                rowMap.set(v.row, [v.column])
              }
            })
            let datas = []
            that.tblDatas.forEach((v, i) => {
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
                  columns.push({ content: j, error: !Check.isNullString(colMap.get(k + 1)) })
                })
                datas.push({ columns: columns, error: Check.isRealArray(cols) })
              }
            })
            that.table.datas = datas
          } else {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack(-2)
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .import-view {
    .vx-table {
      .vx-table--row.error {
        background: #fdeae6;
      }
      .cell {
        .error {
          color: red;
        }
      }
    }
  }
</style>
