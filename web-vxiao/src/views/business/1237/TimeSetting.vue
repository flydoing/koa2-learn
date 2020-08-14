<template>
  <page title="考勤时间设置">
    <div class="time-setting">
      <div class="category-title text">非课时在时段内即为正常签到</div>
      <ViewTable :tableData="atndTable"
                 :multiple="true">
        <template slot="content">
          <template v-for="(row,i) in atndTable.datas">
            <tr class="t-row"
                :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
                :key="i">
              <td :style="{color:row.color?row.color:'#333'}"
                  v-for="(cell,o) in row.columns"
                  :key="o"
                  class="t-cell"
                  @click="handleColumn(cell,row,i,o)">
                <template v-if="o==0">
                  <template v-if="cell.type == 'item'">
                    <i v-if="cell.isCustom"
                       class="el-icon-error remove-icon"
                       @click.stop="handleRemove(cell, row, i, o)"></i>
                    <label v-html="cell.text"></label>
                  </template>
                  <template v-else>
                    <div @click="handleAdd(cell, row, i, o)">
                      <i class="el-icon-plus plus-icon"></i>
                      <label v-html="cell.text"></label>
                    </div>
                  </template>
                </template>
                <template v-else-if="o==1">
                  <div :class="{'text-color': cell.isCustom}"
                       v-html="cell.text"></div>
                </template>
                <template v-else-if="o==3">
                  <template v-if="cell.whether">
                    <div v-for="(item,k) in cell.whether"
                         :key="k"
                         @click="handleWhether(item, cell, i, o)">
                      <i class="ico ico-select"
                         :class="{'active':item.selected}"></i>
                      <label v-html="item.text"></label>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div :class="{'text-color': hasObject(cell.item)}"
                       v-html="cell.text"></div>
                </template>
              </td>
            </tr>
          </template>
        </template>
      </ViewTable>
      <div class="category-title">到离校考勤</div>
      <ViewTable :tableData="leaveTable"
                 :multiple="true">
        <template slot="content">
          <template v-for="(row,i) in leaveTable.datas">
            <tr class="t-row"
                :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
                :key="i">
              <td :style="{color:row.color?row.color:'#333'}"
                  v-for="(cell,o) in row.columns"
                  :key="o"
                  class="t-cell"
                  @click="handleColumn(cell,row,i,o)">
                <template v-if="o==0">
                  <template v-if="cell.type == 'item'">
                    <i v-if="cell.isCustom"
                       class="el-icon-error remove-icon"
                       @click.stop="handleRemove(cell, row, i, o)"></i>
                    <label v-html="cell.text"></label>
                  </template>
                  <template v-else>
                    <div @click="handleAdd(cell, row, i, o)">
                      <i class="el-icon-plus plus-icon"></i>
                      <label v-html="cell.text"></label>
                    </div>
                  </template>
                </template>
                <template v-else-if="o==1">
                  <div :class="{'text-color': cell.isCustom}"
                       v-html="cell.item&&cell.item.section==100?'无需设置':cell.text"></div>
                </template>
                <template v-else>
                  <div :class="{'text-color': hasObject(cell.item)}"
                       v-html="cell.text"></div>
                </template>
              </td>
            </tr>
          </template>
        </template>
      </ViewTable>
      <div class="category-title">教师考勤</div>
      <ViewTable :tableData="tchAtndTable"
                 :multiple="true">
        <template slot="content">
          <template v-for="(row,i) in tchAtndTable.datas">
            <tr class="t-row"
                :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
                :key="i">
              <td :style="{color:row.color?row.color:'#333'}"
                  v-for="(cell,o) in row.columns"
                  :key="o"
                  class="t-cell"
                  @click="handleColumn(cell,row,i,o)">
                <template v-if="o==0">
                  <template v-if="cell.type == 'item'">
                    <i v-if="cell.isCustom"
                       class="el-icon-error remove-icon"
                       @click.stop="handleRemove(cell, row, i, o)"></i>
                    <label v-html="cell.text"></label>
                  </template>
                  <template v-else>
                    <div @click="handleAdd(cell, row, i, o)">
                      <i class="el-icon-plus plus-icon"></i>
                      <label v-html="cell.text"></label>
                    </div>
                  </template>
                </template>
                <template v-else-if="o==1">
                  <div :class="{'text-color': cell.isCustom}"
                       v-html="cell.text"></div>
                </template>
                <template v-else-if="o==3">
                  <template v-if="cell.whether">
                    <div v-for="(item,k) in cell.whether"
                         :key="k"
                         @click="handleWhether(item, cell, i, o)">
                      <i class="ico ico-select"
                         :class="{'active':item.selected}"></i>
                      <label v-html="item.text"></label>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div :class="{'text-color': hasObject(cell.item)}"
                       v-html="cell.text"></div>
                </template>
              </td>
            </tr>
          </template>
        </template>
      </ViewTable>
      <div class="category-title">宿舍考勤</div>
      <ViewTable :tableData="dorAtndTable"
                 :multiple="true">
        <template slot="content">
          <template v-for="(row,i) in dorAtndTable.datas">
            <tr class="t-row"
                :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
                :key="i">
              <td :style="{color:row.color?row.color:'#333'}"
                  v-for="(cell,o) in row.columns"
                  :key="o"
                  class="t-cell"
                  @click="handleColumn(cell,row,i,o)">
                <template v-if="o==0">
                  <template v-if="cell.type == 'item'">
                    <i v-if="cell.isCustom"
                       class="el-icon-error remove-icon"
                       @click.stop="handleRemove(cell, row, i, o)"></i>
                    <label v-html="cell.text"></label>
                  </template>
                  <template v-else>
                    <div @click="handleAdd(cell, row, i, o)">
                      <i class="el-icon-plus plus-icon"></i>
                      <label v-html="cell.text"></label>
                    </div>
                  </template>
                </template>
                <template v-else-if="o==1">
                  <div :class="{'text-color': cell.isCustom}"
                       v-html="cell.text"></div>
                </template>
                <template v-else-if="o==3">
                  <template v-if="cell.whether">
                    <div v-for="(item,k) in cell.whether"
                         :key="k"
                         @click="handleWhether(item, cell, i, o)">
                      <i class="ico ico-select"
                         :class="{'active':item.selected}"></i>
                      <label v-html="item.text"></label>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div :class="{'text-color': hasObject(cell.item)}"
                       v-html="cell.text"></div>
                </template>
              </td>
            </tr>
          </template>
        </template>
      </ViewTable>
      <SelectTime v-if="curItem"
                  :startTime="curItem.node.startTime"
                  :endTime="curItem.node.endTime"
                  :show.sync="showSelectTime"
                  @confirm="handleTimeConfirm"></SelectTime>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'

  export default {
    mixins: [R],
    components: {
      ViewTable: resolve => require(['./Table'], resolve),
      SelectTime: resolve => require(['./SelectTime'], resolve)
    },
    data() {
      return {
        atndTable: {
          lockRows: 1,
          lockColumns: 0,
          columns: ['考勤名称', '时段', '考勤对象', '限定场所'],
          datas: []
        },
        tchAtndTable: {
          lockRows: 1,
          lockColumns: 0,
          columns: ['考勤名称', '时段', '考勤对象', '限定场所'],
          datas: []
        },
        leaveTable: {
          lockRows: 1,
          lockColumns: 0,
          columns: ['到离校', '时段', '考勤对象'],
          datas: []
        },
        dorAtndTable: {
          lockRows: 1,
          lockColumns: 0,
          columns: ['考勤名称', '时段', '考勤对象', '限定场所'],
          datas: []
        },
        showSelectTime: false,
        curItem: null
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        attendance: 'getAttendance'
      })
    },
    methods: {
      ...mapActions(['setAttendance']),
      fetchData() {
        const that = this
        Api.getTimeTable(that.currentGroup.parentId).then(res => {
          if (res.attendanceNotifys) {
            let tData = res.attendanceNotifys[0]
            tData.sectionAttendances &&
              tData.sectionAttendances.forEach((v, i) => {
                that.atndTable.datas.push(that.initRowData(v, false, '1'))
              })
            tData.customerAttendances &&
              tData.customerAttendances.forEach((v, i) => {
                that.atndTable.datas.push(that.initRowData(v, true, '1'))
              })
            this.atndTable.datas.push(this.getNewRow('1'))

            tData.inOrOutAttendances &&
              tData.inOrOutAttendances.forEach((v, i) => {
                that.leaveTable.datas.push(that.initRowData(v, v.section !== 100, '2'))
              })
            this.leaveTable.datas.push(this.getNewRow('2'))

            tData.dutyAttendances &&
              tData.dutyAttendances.forEach((v, i) => {
                that.tchAtndTable.datas.push(that.initRowData(v, true, '3'))
              })
            this.tchAtndTable.datas.push(this.getNewRow('3'))

            tData.dormitoryAttendances &&
              tData.dormitoryAttendances.forEach((v, i) => {
                that.dorAtndTable.datas.push(that.initRowData(v, true, '4'))
              })
            this.dorAtndTable.datas.push(this.getNewRow('4'))
          }
        })
      },
      // 判断是否已有设置考勤对象
      hasObject(item) {
        return item && item.groupMap !== undefined
      },
      getRow(type) {
        let row = {
          clickAble: true,
          isSummary: false,
          columns: [{ text: '', type: 'item', tableType: type }, { text: '请选择', type: 'time', tableType: type }, { text: '请选择', type: 'group', tableType: type }]
        }
        if (type !== '2') {
          row.columns.push({
            text: '',
            whether: [{ text: '是', selected: false, value: 1 }, { text: '否', selected: false, value: 0 }]
          })
        }
        return row
      },
      getNewRow(type) {
        let row = {
          clickAble: true,
          isSummary: false,
          columns: [{ text: '新增', type: 'add', isCustom: true, tableType: type }, { text: '', tableType: type }, { text: '', tableType: type }]
        }
        if (type !== '2') {
          row.columns.push({ text: '', tableType: type })
        }
        return row
      },
      initRowData(v, isCustom, type) {
        let row = this.getRow(type)
        row.columns[0] = { ...row.columns[0], item: v, text: v.attendanceName, isCustom: isCustom, tableType: type }
        row.columns[1] = { ...row.columns[1], item: v, text: `${v.startTime}-${v.endTime}`, isCustom: isCustom, tableType: type }

        let arr = []
        if (v.groupMap) {
          for (let g in v.groupMap) {
            arr.push(v.groupMap[g])
          }
        }
        let txt = v.groupMap ? arr.join('、') : '请选择'
        row.columns[2] = { ...row.columns[2], item: v, text: txt, isCustom: isCustom, tableType: type }

        if (type !== '2') {
          let wValue = v.restrictedPlace ? 1 : 0
          let whether = row.columns[3].whether.map(w => {
            w.value === wValue && (w.selected = true)
            return w
          })
          row.columns[3] = { ...row.columns[3], item: v, whether: whether, isCustom: isCustom }
        }

        return row
      },
      handleColumn(cell, row, rIndex, cIndex) {
        if (cell.type === 'item' && cell.isCustom) {
          this.setAttendance({ node: cell.item, tableType: cell.tableType })
          this.routePush({ name: 'nodeEdit1237' })
        } else if (cell.type === 'group') {
          this.setAttendance({ node: cell.item, isCustom: cell.isCustom, tableType: cell.tableType })
          this.routePush({ name: 'selectGroup1237' })
        } else if (cell.type === 'time' && cell.isCustom) {
          this.curItem = { cell: cell, rIndex: rIndex, node: cell.item }
          this.showSelectTime = true
        }
      },
      handleWhether(item, cell, rIndex, cIndex) {
        const that = this

        let node = cell.item
        node.restrictedPlace = item.value === 1

        let postData = { schoolId: that.currentGroup.parentId }
        if (cell.tableType === '3') {
          postData.dutyAttendances = [node]
        } else if (cell.tableType === '4') {
          postData.dormitoryAttendances = [node]
        } else {
          cell.isCustom ? (postData.customerAttendances = [node]) : (postData.sectionAttendances = [node])
        }

        Api.commitTimeNode(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          let row = that.initRowData(node, cell.isCustom, '1')
          if (cell.tableType === '3') {
            that.tchAtndTable.datas.splice(rIndex, 1, row)
          } else if (cell.tableType === '4') {
            that.dorAtndTable.datas.splice(rIndex, 1, row)
          } else {
            that.atndTable.datas.splice(rIndex, 1, row)
          }
        })
      },
      handleTimeConfirm(times) {
        const that = this
        let cell = that.curItem.cell
        let rIndex = that.curItem.rIndex

        let node = that.curItem.node
        node.startTime = times[0]
        node.endTime = times[1]

        let postData = { schoolId: that.currentGroup.parentId }
        if (cell.tableType === '1') {
          postData.customerAttendances = [node]
        } else if (cell.tableType === '2') {
          postData.inOrOutAttendances = [{ ...node, sendMsg: true }]
        } else if (cell.tableType === '3') {
          postData.dutyAttendances = [node]
        } else {
          postData.dormitoryAttendances = [node]
        }

        Api.commitTimeNode(postData).then(res => {
          let row = that.initRowData(node, cell.isCustom, cell.tableType)
          if (cell.tableType === '1') {
            that.atndTable.datas.splice(rIndex, 1, row)
          } else if (cell.tableType === '2') {
            that.leaveTable.datas.splice(rIndex, 1, row)
          } else if (cell.tableType === '3') {
            that.tchAtndTable.datas.splice(rIndex, 1, row)
          } else {
            that.dorAtndTable.datas.splice(rIndex, 1, row)
          }
          this.showSelectTime = false
          that.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleRemove(cell, row, rIndex, cIndex) {
        const that = this
        this.$confirm('确定删除该项？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = { schoolId: that.currentGroup.parentId }
          if (cell.tableType === '1') {
            postData.customerAttendances = [{ id: cell.item.id }]
          } else if (cell.tableType === '2') {
            postData.inOrOutAttendances = [{ id: cell.item.id }]
          } else if (cell.tableType === '3') {
            postData.dutyAttendances = [{ id: cell.item.id }]
          } else {
            postData.dormitoryAttendances = [{ id: cell.item.id }]
          }
          Api.removeTimeNode(postData).then(res => {
            if (cell.tableType === '1') {
              that.atndTable.datas.splice(rIndex, 1)
            } else if (cell.tableType === '2') {
              that.leaveTable.datas.splice(rIndex, 1)
            } else if (cell.tableType === '3') {
              that.tchAtndTable.datas.splice(rIndex, 1)
            } else {
              that.dorAtndTable.datas.splice(rIndex, 1)
            }
            that.$message({ message: '操作成功', type: 'success' })
          })
        })
      },
      handleAdd(cell, row, rIndex, cIndex) {
        let sTime = ''
        let eTime = ''
        let index = rIndex ? rIndex - 1 : rIndex
        let date = DateUtils.format(new Date(), DateUtils.YMD)
        if (cell.tableType !== '2') {
          let cNode = null
          if (cell.tableType === '3') {
            cNode = this.tchAtndTable.datas[index].columns[0]
          } else if (cell.tableType === '4') {
            cNode = this.dorAtndTable.datas[index].columns[0]
          } else {
            cNode = this.atndTable.datas[index].columns[0]
          }

          if (cNode.isCustom && cNode.item) {
            let s = new Date(`${date} ${cNode.item.endTime}`).getTime() + 1000 * 60 * 30
            let e = new Date(`${date} ${cNode.item.endTime}`).getTime() + 1000 * 60 * 60
            sTime = DateUtils.format(new Date(s), DateUtils.HM)
            eTime = DateUtils.format(new Date(e), DateUtils.HM)
          } else {
            sTime = '07:00'
            eTime = '07:30'
          }
        } else {
          let rData = this.leaveTable.datas[index]
          if (rData && rData.columns[0].item.section !== 100) {
            let cNode = rData.columns[0]
            let s = new Date(`${date} ${cNode.item.endTime}`).getTime() + 1000 * 60 * 30
            let e = new Date(`${date} ${cNode.item.endTime}`).getTime() + 1000 * 60 * 60
            sTime = DateUtils.format(new Date(s), DateUtils.HM)
            eTime = DateUtils.format(new Date(e), DateUtils.HM)
          } else {
            sTime = '07:00'
            eTime = '07:30'
          }
        }
        this.setAttendance({ node: null, sTime: sTime, eTime: eTime, tableType: cell.tableType })
        this.routePush({ name: 'nodeEdit1237' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .time-setting {
    .remove-icon {
      color: red;
      font-size: rem(18);
      vertical-align: middle;
    }

    .plus-icon {
      @include fc;
      font-size: rem(20);
      vertical-align: middle;
    }

    .t-table {
      .t-row.is-click {
        td:last-child:after {
          display: none;
        }
      }
    }

    .t-cell {
      & > div {
        display: inline-block;
        vertical-align: middle;
        margin-left: rem(5);

        &:first-child {
          margin-left: 0;
        }
      }

      label {
        vertical-align: middle;
        cursor: pointer;
      }

      .ico {
        display: inline-block;
        vertical-align: middle;
        width: rem(25);
      }
    }
  }
</style>
