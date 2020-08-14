<template>
  <page title="巡检排班">
    <div slot="top">
      <Tabs @click="handleCampus"
            :showBtns="schedule.campuses.length > 1"
            theme="theme-1"
            :value="campusValue">
        <TabPane v-for="(item,i) in schedule.campuses"
                 :key="i"
                 :label="item.name"
                 :name="i"
                 :currentData="item"></TabPane>
      </Tabs>
      <div class="category-title"></div>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleCount">
        <div class="el-dropdown-link">
          <item class="is-count">
            <div slot="main">巡检次数</div>
            <div slot="remark"
                 v-html="schedule.countMeta.obj"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in counts"
                            :key="i"
                            :command="item">{{item}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="inspection-schedule">
      <vx-table v-if="table"
                :data="table.datas"
                :height="maxHeight - 52"
                stripe>
        <template v-if="table.columns">
          <vx-table-column width="120"
                           v-for="(item,i) in table.columns"
                           :label="item"
                           :key="i"
                           :fixed="i===0 && table.columns.length > 4">
            <template slot-scope="scope">
              <div class="each-cell"
                   @click="handleColumn(scope.row.columns[i],scope.row,scope.$index,i)">
                <template v-if="scope.row.columns[i].handle == 'time' && scope.row.columns[i].time">
                  <label v-html="scope.row.columns[i].text"></label>
                  <i class='ico ico-delete'
                     @click.stop="handleTimeRemove(scope.row.columns[i], scope.$index, i)"></i>
                </template>
                <template v-else>
                  <label v-html="scope.row.columns[i].text"></label>
                </template>
              </div>
            </template>
          </vx-table-column>
        </template>
      </vx-table>
    </div>
    <SelectTime v-if="curItem"
                :sTime="curItem.cell.time"
                :show.sync="showSelectTime"
                @confirm="handleTimeConfirm"></SelectTime>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'

  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane,
      Table: resolve => require(['./Table'], resolve),
      SelectTime: resolve => require(['./SelectTime'], resolve)
    },
    props: {},
    computed: {
      ...mapGetters({
        inspection: 'getInspection'
      }),
      campusValue() {
        let campus = this.schedule.campuses.filter(v => {
          return v.selected
        })[0]
        return campus ? campus.index : 0
      }
    },
    data() {
      return {
        table: null,
        schedule: {
          campuses: [],
          countMeta: { obj: 2 }
        },
        counts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        showSelectTime: false,
        curItem: null,
        maxHeight: 0
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setInspection', 'modifyMetaData']),
      fetchData() {
        const that = this
        if (that.inspection.schedule) {
          that.schedule = JSON.parse(JSON.stringify(that.inspection.schedule))
          that.loadTableData()
        } else {
          GroupApi.getSchoolGroupsByType(that.currentGroup.parentId, '4').then(res => {
            res.groups.forEach((v, i) => {
              that.schedule.campuses.push({ ...v, selected: i === 0, index: i })
            })
            that.loadTableData()
          })
        }
      },
      loadTableData() {
        const that = this
        // 表格对象数据
        let datas = []
        let headers = ['场所']

        let campus = that.schedule.campuses.filter(v => {
          return v.selected
        })[0]
        this.table = null
        Api.loadScheduleTableData(that.currentGroup.parentId, campus.id).then(res => {
          let schedule = res.place || {}

          // 批量设置行

          let batchColumns = [{ id: schedule.id, text: schedule.name }]
          let count = schedule.metaData ? parseInt(schedule.metaData.obj) : 2
          for (let i = 0; i < count; i++) {
            headers.push(`巡检时间${i + 1}`, '值日人')
            batchColumns.push({ id: schedule.id, text: '批量设置', type: 'batch', handle: 'time', round: i + 1 })
            batchColumns.push({ id: schedule.id, text: '批量设置', type: 'batch', handle: 'user', round: i + 1 })
          }
          datas.push({ columns: batchColumns, clickAble: false, isSummary: true })

          if (Check.isRealArray(schedule.childs)) {
            schedule.childs.forEach((v, i) => {
              let columns = [{ id: v.placeId, text: v.name }]
              if (Check.isRealArray(v.dutys)) {
                v.dutys.forEach((j, k) => {
                  let tTxt = j.stime ? `${j.stime}前` : '设置'
                  let uTxt = j.dutyUsers
                    ? j.dutyUsers
                        .map(u => {
                          return u.name
                        })
                        .join('，')
                    : '设置'
                  columns.push({ id: j.id, text: tTxt, placeId: v.placeId, time: j.stime || '', type: 'set', handle: 'time', round: k + 1 })
                  columns.push({ id: j.id, text: uTxt, placeId: v.placeId, users: j.dutyUsers || [], type: 'set', handle: 'user', round: k + 1 })
                })
                if (v.dutys.length < count) {
                  for (let n = v.dutys.length; n < count; n++) {
                    columns.push({ placeId: v.placeId, text: '设置', type: 'set', handle: 'time', round: n + 1 })
                    columns.push({ placeId: v.placeId, text: '设置', type: 'set', handle: 'user', round: n + 1 })
                  }
                }
              }
              datas.push({ columns: columns, clickAble: false, isSummary: false })
            })
          }

          that.table = {
            datas: datas,
            columns: headers
          }
          that.schedule.countMeta = schedule.metaData || { obj: 2, metaType: 'm_inspection_duty_times', userId: campus.id }
        })
      },
      handleCount(count) {
        let meta = { ...this.schedule.countMeta, obj: count }
        this.modifyMetaData(meta).then(res => {
          this.loadTableData()
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleCampus(item) {
        this.schedule.campuses = this.schedule.campuses.map(v => {
          v.selected = v.id === item.sourceData.id
          return v
        })
        this.loadTableData()
      },
      handleColumn(cell, row, rIndex, cIndex) {
        if (cell.handle === 'time') {
          this.curItem = { cell: cell, rIndex: rIndex, cIndex: cIndex }
          this.showSelectTime = true
        } else if (cell.handle === 'user' && cell.type === 'batch') {
          this.setInspection({ schedule: this.schedule, item: cell, users: [] })
          this.routePush({ name: 'selectInspector1216' })
        } else if (cell.handle === 'user') {
          this.setInspection({ schedule: this.schedule, users: cell.users, item: cell })
          this.routePush({ name: 'inspectorList1216' })
        }
      },
      handleTimeConfirm(time) {
        const that = this
        let item = that.curItem
        let cell = that.curItem.cell
        let postData = { schoolId: that.currentGroup.parentId, stime: time, round: cell.round }

        if (cell.type === 'batch') {
          let campus = that.schedule.campuses.filter(v => {
            return v.selected
          })[0]
          Api.commitScheduleBatchSetting({ ...postData, campusId: campus.id }).then(res => {
            that.table.datas.forEach((v, i) => {
              if (i !== 0) {
                let c = that.table.datas[i].columns[item.cIndex]
                that.$set(that.table.datas[i].columns, item.cIndex, { ...c, time: time, text: `${time}前` })
              }
            })
            that.$message({ message: '操作成功', type: 'success' })
            that.showSelectTime = false
          })
        } else {
          Api.commitScheduleSetting({ ...postData, placeId: cell.placeId }).then(res => {
            that.$set(that.table.datas[item.rIndex].columns, item.cIndex, { ...cell, time: time, text: `${time}前` })
            that.$message({ message: '操作成功', type: 'success' })
            that.showSelectTime = false
          })
        }
      },
      handleTimeRemove(cell, rIndex, cIndex) {
        const that = this
        that
          .$confirm('确定删除该巡检时间？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            Api.commitScheduleSetting({
              placeId: cell.placeId,
              schoolId: that.currentGroup.parentId,
              round: cell.round,
              stime: ''
            }).then(res => {
              that.$set(that.table.datas[rIndex].columns, cIndex, { ...cell, time: '', text: '设置' })
              that.$message({ message: '操作成功', type: 'success' })
            })
          })
      }
    },
    watch: {
      table(v) {
        this.table = v
      }
    }
  }
</script>
<style lang="scss">
  .inspection-schedule {
    .each-cell {
      cursor: pointer;
      position: relative;
      label {
        cursor: pointer;
      }
      .ico-delete {
        position: absolute;
        right: rem(5);
        display: none;
        top: 50%;
        margin-top: rem(-9);
      }
      &:hover {
        .ico-delete {
          display: block;
        }
      }
    }
    .is-count {
      border-bottom: 0 !important;
    }
  }
</style>
