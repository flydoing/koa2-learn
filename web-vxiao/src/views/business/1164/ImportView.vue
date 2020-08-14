<template>
  <page title="导入排考总表"
        ref="_page"
        @submit="handleSubmit"
        closePrompt
        hasSubmit
        listenBack
        @back="handleBack">
    <div class="import-view">
      <vx-table :data="table.datas"
                :height="maxHeight"
                stripe
                :rowClassName="rowClass">
        <vx-table-column width="120"
                         v-for="(item, i) in table.columns"
                         :label="item"
                         :key="i"
                         :fixed="i===0 && table.columns.length > 4">
          <template slot-scope="scope">
            <label :class="{'error':scope.row.columns[i].error}"
                   v-html="scope.row.columns[i].content"
                   @click="handleColumn($event,scope.$index,i)"></label>
          </template>
        </vx-table-column>
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
        table: {
          columns: [],
          datas: []
        },
        tblDatas: [],
        maxHeight: 0
      }
    },
    mounted() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      })
    },
    methods: {
      ...mapActions(['deleteArrangeExamProp']),
      rowClass(rowIndex, row) {
        if (row.error) {
          return 'error'
        }
        return ''
      },
      fetchData() {
        const that = this
        let tableDatas = that.arrange.tableDatas
        if (Check.isRealArray(tableDatas)) {
          let datas = []
          tableDatas.forEach((v, i) => {
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
              that.table.datas.push({ columns: columns, error: false })
            }
            datas.push(row)
          })
          that.tblDatas = JSON.parse(JSON.stringify(datas))
        }
      },
      handleColumn(e, rIndex, cIndex) {
        const that = this
        let data = that.tblDatas[rIndex + 1][cIndex - 1]
        this.$prompt(' ', '新增', {
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
        let form = that.arrange.form
        Api.importSummaryArrangeData(that.currentGroup.parentId, {
          dataJson: JSON.stringify(that.tblDatas)
        }).then(res => {
          if (res.errorDataJson) {
            that.$message({ message: res.msg, type: 'error' })
            let errorRows = JSON.parse(res.errorDataJson)
            let rowMap = new Map()
            errorRows.forEach((v, i) => {
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
            let datas = [...that.tblDatas]
            let msgType = this.routeQuery('msgType')
            let postData = that.constructionMessage({
              type: '1164',
              groupId: that.groupId,
              content: form.name,
              startTime: DateUtils.format_0800(form.startTime),
              endTime: DateUtils.format_0800(form.endTime)
            })
            if (msgType) {
              datas.splice(0, 1)
              postData.msgType = msgType
            }
            postData.msgJson = JSON.stringify({
              seat: JSON.stringify(datas),
              groupId: that.groupId
            })
            that.addMessage(postData).then(res => {
              this.deleteArrangeExamProp('form')
              this.deleteArrangeExamProp('tableDatas')
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack(-3)
            })
          }
        })
      },
      handleBack() {
        this.deleteArrangeExamProp('form')
        this.deleteArrangeExamProp('tableDatas')
        this.routeBack()
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
