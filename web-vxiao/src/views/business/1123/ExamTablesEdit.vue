<template>
  <page title="导入联考成绩"
        hasSubmit
        @submit="submitHandle">
    <Tabs theme="theme-1">
      <TabPane v-for="(table, t) in datas.tables"
               :key="t"
               :label="table.sheetName">
        <Scroller>
          <Tables :tableData="initDatas(table)">
            <template slot="lock-column">
              <tr class="t-row"
                  v-for="(row,i) in initDatas(table).datas"
                  :key="i">
                <template v-for="(cell,j) in row.columns">
                  <td v-if="j<initDatas(table).lockColumns"
                      :style="{color:row.color?row.color:'#333'}"
                      class="t-cell"
                      :key="j">
                    <input type="text"
                           v-model="cell.content"
                           class="cell-input"
                           :class="{'error': cell.err}"
                           @blur="editHandle($event, i, j, t)"
                           @focus="focusHandle($event)">
                  </td>
                </template>
              </tr>
            </template>
            <template v-for="(row,i) in initDatas(table).datas"
                      slot="content">
              <tr class="t-row"
                  :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
                  :key="i">
                <td v-if="row.colspan>0"
                    :style="{color:row.color?row.color:'#333'}"
                    :colspan="row.colspan"
                    v-html="row.colspanText"
                    class="t-cell t-cell-colspan"></td>
                <td v-else
                    :style="{color:row.color?row.color:'#333'}"
                    v-for="(cell,o) in row.columns"
                    :key="o"
                    class="t-cell">
                  <input type="text"
                         v-model="cell.content"
                         class="cell-input"
                         :class="{'error': cell.err}"
                         @blur="editHandle($event, i, o, t)"
                         @focus="focusHandle($event)">
                </td>
              </tr>
            </template>
          </Tables>
        </Scroller>
      </TabPane>
    </Tabs>
  </page>
</template>
<script>
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import Tables from '@/views/business/1237/Table'
  import G from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [G],
    components: {
      Tabs,
      TabPane,
      Tables
    },
    data() {
      return {
        datas: {},
        curInputValue: ''
      }
    },
    computed: {
      ...mapGetters({
        cacheInfo: 'getCreateInfo'
      })
    },
    created() {
      this.datas = {
        ...this.cacheInfo.datas
      }
      if (this.datas.errNum > 0) {
        this.errTips(this.datas.tables)
      }
    },
    methods: {
      ...mapActions(['saveCreateInfo', 'clearCreateInfo', 'modifyChannelMessage']),
      initDatas(tableDatas) {
        let datas = []
        tableDatas.table.forEach((d, i) => {
          let obj = {}
          obj.clickAble = false
          obj.cellType = 'input'
          obj.columns = []
          d.forEach(td => {
            obj.columns.push({
              content: td.content,
              err: td.err
            })
          })
          datas.push(obj)
        })
        let table = {
          lockRows: 1,
          lockColumns: 3,
          columns: [...tableDatas.columnNames],
          datas: datas
        }
        return table
      },
      submitHandle() {
        let tables = JSON.parse(JSON.stringify(this.cacheInfo.datas.tables))
        tables.forEach(t => {
          delete t.errCells
          t.table.forEach(tr => {
            tr.forEach(td => {
              td.err && delete td.err
            })
          })
        })
        if (this.cacheInfo.datas.errNum > 0) {
          Api.verifyTables({
            groupId: this.currentGroup.groupId,
            tables: tables
          }).then(res => {
            if (res.errNum > 0) {
              this.errTips(res.tables)
            } else {
              this.commitTables(res.tables)
            }
          })
        } else {
          this.commitTables(tables)
        }
      },
      editHandle(event, rowIndex, colIndex, tableIndex) {
        if (event.target.value !== this.curInputValue) {
          event.target.className = 'cell-input'
          let Tables = JSON.parse(JSON.stringify(this.cacheInfo.datas.tables))
          let tempObj = {
            ...[...this.cacheInfo.datas.tables][tableIndex].table[rowIndex][colIndex],
            content: event.target.value
          }
          tempObj.err && delete tempObj.err
          Tables[tableIndex].table[rowIndex].splice(colIndex, 1, tempObj)
          this.saveCreateInfo({
            ...this.cacheInfo,
            datas: {
              ...this.cacheInfo.datas,
              tables: Tables
            }
          })
        }
      },
      errTips(tables) {
        // let errtips = []
        // tables.forEach((table) => {
        //   let sheetName = table.sheetName
        //   table.errCells &&
        //     table.errCells.forEach((err) => {
        //       let positon = `第${err.row}行第${err.col}列：${err.content}${err.columnName}${err.err}`
        //       errtips.push(`${sheetName}——${positon}`)
        //     })
        // })
        // this.$alert(errtips.join('<br>'), '错误提示', {
        //   dangerouslyUseHTMLString: true
        // }).catch(() => {})
      },
      focusHandle(event) {
        this.curInputValue = event.target.value
      },
      commitTables(tables) {
        Api.submitTables({
          entranceExam: {
            examDate: this.cacheInfo.dateValue,
            name: this.cacheInfo.examinationName,
            isDisplayRank: this.cacheInfo.showRanking ? '1' : '0',
            isDisplayAvg: this.cacheInfo.showAverage ? '1' : '0',
            isDisplayStdScore: this.cacheInfo.showStandardScore ? '1' : '0',
            isDisplayVariance: this.cacheInfo.showVariance ? '1' : '0',
            isDisplayStdDeviation: this.cacheInfo.showStdDeviation ? '1' : '0'
          },
          groupId: this.currentGroup.groupId,
          tables: tables,
          ...this.commonMessage()
        }).then(res => {
          this.$message({ type: 'success', message: '成功' })
          if (res.message) {
            this.modifyChannelMessage(res.message)
          }
          this.$router.go(-2)
          this.clearCreateInfo()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .cell-input {
    border: none;
    border: 1px solid transparent;
    background: transparent;
    &.error {
      color: red;
    }
  }
</style>
