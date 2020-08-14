<template>
  <page title="考勤时间设置">
    <div class="time-setting">
      <div class="category-title text">非课时在时段内即为正常签到</div>
      <Table :tableData="table">
        <template slot="lock-column">
          <tr class="t-row"
              v-for="(row,i) in table.datas"
              :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
              :key="i">
            <template v-for="(cell,j) in row.columns">
              <td v-if="j < table.lockColumns"
                  class="t-cell"
                  :style="{color:row.color?row.color:'#333'}"
                  :key="j"
                  @click="handleColumn(cell,row,i,j)">
                <template v-if="cell.type == 'item'">
                  <i v-if="cell.isCustom"
                     class="el-icon-error remove-icon"
                     @click.stop="handleRemove(cell, row, i, j)"></i>
                  <label v-html="cell.text"></label>
                </template>
                <template v-else>
                  <div @click="handleAdd(cell, row, i, j)">
                    <i class="el-icon-plus plus-icon"></i>
                    <label v-html="cell.text"></label>
                  </div>
                </template>
              </td>
            </template>
          </tr>
        </template>
        <template slot="content">
          <template v-for="(row,i) in table.datas">
            <tr class="t-row"
                :class="{'t-summary':row.isSummary,'is-click':row.clickAble==null||row.clickAble===true}"
                :key="i">
              <td :style="{color:row.color?row.color:'#333'}"
                  v-for="(cell,o) in row.columns"
                  :key="o"
                  class="t-cell"
                  @click="handleColumn(cell,row,i,o)">
                <template v-if="o==0">
                  <template v-if="cell.type == 'remove'">
                    <i class="el-icon-error remove-icon"></i>
                  </template>
                  <template v-else>
                    <i class="el-icon-plus plus-icon"></i>
                  </template>
                  <label v-html="cell.text"></label>
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
                <template v-else-if="o==4 || o==5">
                  <template v-if="cell.identitys">
                    <div v-for="(item,k) in cell.identitys"
                         :key="k"
                         @click="handleIdentity(item, cell, i, o)">
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
      </Table>
    </div>
    <SelectTime v-if="curItem"
                :startTime="curItem.node.startTime"
                :endTime="curItem.node.endTime"
                :show.sync="showSelectTime"
                @confirm="handleTimeConfirm"></SelectTime>
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
      Table: resolve => require(['./Table'], resolve),
      SelectTime: resolve => require(['./SelectTime'], resolve)
    },
    data() {
      return {
        identitys: [
          {
            text: '班主任',
            type: 'headTeacher',
            selected: false
          },
          {
            text: '任课老师',
            type: 'sectionTeacher',
            selected: false
          },
          {
            text: '学生',
            type: 'student',
            selected: false
          },
          {
            text: '家长',
            type: 'studentParent',
            selected: false
          },
          {
            text: '管理员',
            type: 'appManager',
            selected: false
          }
        ],
        table: {
          lockRows: 1,
          lockColumns: 1,
          columns: ['节次', '时段', '考勤对象', '限定场所', '考勤正常，自动提醒', '考勤异常，自动提醒'],
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
                that.table.datas.push(that.initRowData(v, false))
              })
            tData.customerAttendances &&
              tData.customerAttendances.forEach((v, i) => {
                that.table.datas.push(that.initRowData(v, true))
              })
            this.table.datas.push(this.getNewRow())
          }
        })
      },
      // 判断是否已有设置考勤对象
      hasObject(item) {
        return item && item.groupMap !== undefined
      },
      getRow() {
        let normalIds = JSON.parse(JSON.stringify(this.identitys.slice(0, 4)))
        let exceptionIds = JSON.parse(JSON.stringify(this.identitys))
        let row = {
          clickAble: true,
          isSummary: false,
          columns: [
            { text: '', type: 'item' },
            { text: '请选择', type: 'time' },
            { text: '请选择', type: 'group' },
            { text: '', whether: [{ text: '是', selected: false, value: 1 }, { text: '否', selected: false, value: 0 }] },
            { text: '', identitys: [...normalIds], type: 'normal' },
            { text: '', identitys: [...exceptionIds], type: 'exception' }
          ]
        }
        return row
      },
      getNewRow() {
        return {
          clickAble: true,
          isSummary: false,
          columns: [{ text: '新增', type: 'add', isCustom: true }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }]
        }
      },
      initRowData(v, isCustom) {
        let row = this.getRow()
        row.columns[0] = { ...row.columns[0], item: v, text: v.attendanceName, isCustom: isCustom }
        row.columns[1] = { ...row.columns[1], item: v, text: `${v.startTime}-${v.endTime}`, isCustom: isCustom }

        let arr = []
        if (v.groupMap) {
          for (let g in v.groupMap) {
            arr.push(v.groupMap[g])
          }
        }
        let txt = v.groupMap ? arr.join('、') : '请选择'
        row.columns[2] = { ...row.columns[2], item: v, text: txt.length > 10 ? `${txt.substring(0, 10)}...` : txt, isCustom: isCustom }

        let wValue = v.restrictedPlace ? 1 : 0
        let whether = row.columns[3].whether.map(w => {
          w.value === wValue && (w.selected = true)
          return w
        })
        row.columns[3] = { ...row.columns[3], item: v, whether: whether, isCustom: isCustom }

        let normalIds = row.columns[4].identitys.map(idy => {
          idy.selected = v.normalNotify ? v.normalNotify[idy.type] : false
          return idy
        })
        row.columns[4] = { ...row.columns[4], item: v, identitys: normalIds, isCustom: isCustom }

        let exceptionIds = row.columns[5].identitys.map(idy => {
          idy.selected = v.abnormalNotify ? v.abnormalNotify[idy.type] : false
          return idy
        })
        row.columns[5] = { ...row.columns[5], item: v, identitys: exceptionIds, isCustom: isCustom }

        return row
      },
      handleColumn(cell, row, rIndex, cIndex) {
        if (cell.type === 'item' && cell.isCustom) {
          this.setAttendance({ node: cell.item })
          this.routePush({ name: 'nodeEdit1197' })
        } else if (cell.type === 'group') {
          this.setAttendance({ node: cell.item, isCustom: cell.isCustom })
          this.routePush({ name: 'selectGroup1197' })
        } else if (cell.type === 'time' && cell.isCustom) {
          this.curItem = { cell: cell, rIndex: rIndex, node: cell.item }
          this.showSelectTime = true
        }
      },
      handleTimeConfirm(times) {
        const that = this
        let cell = that.curItem.cell
        let rIndex = that.curItem.rIndex

        let node = that.curItem.node
        node.startTime = times[0]
        node.endTime = times[1]

        let postData = { schoolId: that.currentGroup.parentId }
        cell.isCustom ? (postData.customerAttendances = [node]) : (postData.sectionAttendances = [node])

        Api.commitTimeNode(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          let row = that.initRowData(node, cell.isCustom)
          that.table.datas.splice(rIndex, 1, row)
          this.showSelectTime = false
        })
      },
      handleRemove(cell, row, rIndex, cIndex) {
        const that = this
        that
          .$confirm('确定删除该节次？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            Api.removeTimeNode({ schoolId: that.currentGroup.parentId, customerAttendances: [{ id: cell.item.id }] }).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.table.datas.splice(rIndex, 1)
            })
          })
      },
      handleAdd(cell, row, rIndex, cIndex) {
        let date = DateUtils.format(new Date(), DateUtils.YMD)
        let cNode = this.table.datas[rIndex - 1].columns[0]
        let sTime = ''
        let eTime = ''
        if (cNode.isCustom) {
          let s = new Date(`${date} ${cNode.item.endTime}`).getTime() + 1000 * 60 * 30
          let e = new Date(`${date} ${cNode.item.endTime}`).getTime() + 1000 * 60 * 60
          sTime = DateUtils.format(new Date(s), DateUtils.HM)
          eTime = DateUtils.format(new Date(e), DateUtils.HM)
        } else {
          sTime = '07:00'
          eTime = '07:30'
        }
        this.setAttendance({ node: null, sTime: sTime, eTime: eTime })
        this.routePush({ name: 'nodeEdit1197' })
        // this.table.datas.splice(rIndex, 1)
        // this.table.datas.push(this.getRow())

        // this.table.datas.push(this.getNewRow())
      },
      handleWhether(item, cell, rIndex, cIndex) {
        const that = this

        let node = cell.item
        node.restrictedPlace = item.value === 1

        let postData = { schoolId: that.currentGroup.parentId }
        cell.isCustom ? (postData.customerAttendances = [node]) : (postData.sectionAttendances = [node])

        Api.commitTimeNode(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          let row = that.initRowData(node, cell.isCustom)
          that.table.datas.splice(rIndex, 1, row)
        })
        // this.table.datas[rIndex].columns[cIndex].whether = cell.whether.map(v => {
        //   v.value === item.value ? (v.selected = !item.selected) : (v.selected = false)
        //   return v
        // })
      },
      handleIdentity(item, cell, rIndex, cIndex) {
        const that = this

        let node = cell.item
        if (cell.type === 'exception') {
          node.abnormalNotify[item.type] = !item.selected
        } else {
          node.normalNotify[item.type] = !item.selected
        }

        let postData = { schoolId: that.currentGroup.parentId }
        cell.isCustom ? (postData.customerAttendances = [node]) : (postData.sectionAttendances = [node])

        Api.commitTimeNode(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          let row = that.initRowData(node, cell.isCustom)
          that.table.datas.splice(rIndex, 1, row)
        })
        // this.table.datas[rIndex].columns[cIndex].identitys = cell.identitys.map(v => {
        //   v.type === item.type && (v.selected = !item.selected)
        //   return v
        // })
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
      max-width: initial;
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
    }
  }
</style>
