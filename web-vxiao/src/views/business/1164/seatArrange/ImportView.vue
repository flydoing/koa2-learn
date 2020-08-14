<template>
  <page title="导入排考总表"
        ref="_page"
        @submit="handleSubmit"
        closePrompt
        hasSubmit>
    <div class="import-view">
      <div class="each-tbl"
           v-for="(tbl, t) in tables"
           :key="t">
        <vx-table :data="tbl.datas"
                  stripe
                  @header-cell-click="handleHeader"
                  :headerCellClassName="headerCellClass">
          <vx-table-column width="120"
                           v-for="(item, i) in tbl.columns"
                           :label="item"
                           :key="i">
            <template slot-scope="scope">
              <label :class="{'error':scope.row.columns[i].error}"
                     v-html="scope.row.columns[i].content"
                     @click="handleColumn($event,scope.$index,i,t)"></label>
            </template>
          </vx-table-column>
        </vx-table>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  // import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api from '../api'
  import MixinMessage from '@/views/group/mixinMessage'
  // import DateUtils from '@/utils/date'

  export default {
    mixins: [R, MixinMessage],
    data() {
      return {
        tables: [],
        tblDatas: [],
        errorMap: {},
        maxHeight: 0
      }
    },
    mounted() {
      this.fetchData(this.arrange.tableDatas, this.arrange.errorMap)
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      })
    },
    methods: {
      ...mapActions(['setArrangeExam', 'deleteArrangeExamProp']),
      headerCellClass(table, column, cIndex) {
        if (table.$el) {
          let tIndex = [].indexOf.call(table.$el.parentNode.parentNode.querySelectorAll('.each-tbl'), table.$el.parentNode)
          let error = this.errorMap[tIndex]
          if (error && error.column + 1 === cIndex) {
            return 'error'
          }
          return ''
        }
        return ''
      },
      fetchData(tableDatas, errorMap) {
        const that = this
        let tbls = []
        let tblDatas = []
        if (tableDatas) {
          for (let t in tableDatas) {
            let rowDatas = []
            let tbl = { columns: [], datas: [] }
            tableDatas[t].forEach((v, i) => {
              let row = [...v]
              if (i === 0) {
                tbl.columns.push('序号', ...row)
              } else {
                let headers = tbl.columns
                if (headers.length < row.length) {
                  for (let n = headers.length; n <= row.length; n++) {
                    tbl.columns.push(``)
                    rowDatas[0].push(``)
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
                tbl.datas.push({ columns: columns, error: false })
              }
              rowDatas.push(row)
            })
            tbls.push(tbl)
            tblDatas.push(JSON.parse(JSON.stringify(rowDatas)))
          }

          that.tables = tbls
          that.tblDatas = tblDatas
        }

        if (errorMap) {
          that.errorMap = errorMap
          that.$message({ message: '排考校区或对应校区下的考场不存在', type: 'warning' })
        }
      },
      handleHeader(table, column, cIndex, event) {
        const that = this
        let tIndex = [].indexOf.call(table.$el.parentNode.parentNode.querySelectorAll('.each-tbl'), table.$el.parentNode)
        this.$prompt(' ', '编辑', {
          inputPlaceholder: '输入内容',
          inputValue: column.label,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          that.$set(that.tblDatas[tIndex][0], cIndex - 1, value)
          that.$set(column, 'label', value)
        })
      },
      handleColumn(e, rIndex, cIndex, tIndex) {
        const that = this
        let data = that.tblDatas[tIndex][rIndex + 1][cIndex - 1]
        this.$prompt(' ', '编辑', {
          inputPlaceholder: '输入内容',
          inputValue: data,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          that.$set(that.tblDatas[tIndex][rIndex + 1], cIndex - 1, value)
          that.$set(that.tables[tIndex].datas[rIndex].columns, cIndex, { content: value, error: false })
        })
      },
      handleSubmit() {
        const that = this
        let datas = []
        that.tblDatas.map(v => {
          datas.push(...v)
        })
        let grade = that.arrange.grade
        Api.importSeatArrangeData({
          excelDatas: datas,
          schoolId: that.currentGroup.parentId,
          campusId: grade.parentId,
          gradeId: grade.id,
          gradeName: grade.name
        }).then(res => {
          if (res.reexams) {
            this.setArrangeExam({ reexams: res.reexams })
            this.routeBack()
          } else {
            this.fetchData(res.reexamDatas, res.errorMap)
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .import-view {
    .vx-table {
      th.error {
        color: red;
      }
    }
  }
</style>
