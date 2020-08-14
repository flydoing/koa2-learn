<template>
  <Page title="设置">
    <Tabs theme="theme-1"
          ref="_tab">
      <TabPane v-for="(tab,i) in vRoadGateCategories"
               :key="i"
               :name="i"
               :label="tab.categoryName"
               :currentData="tab">
        <vx-table :data="tab.vRoadGateManagers"
                  :height="scrollerHeight"
                  @cell-click="onCellClick">
          <vx-table-column width="30"
                           label="">
            <template slot-scope="scope">
              <i class="ico ico-delete"
                 v-if="scope.row.id"
                 @click.stop="onRemove(scope.row,scope.$index)" />
            </template>
          </vx-table-column>
          <vx-table-column label="开始时间">
            <template slot-scope="scope">
              <el-time-select v-model="scope.row.startTime"
                              size="mini"
                              placeholder="开始时间"
                              :clearable="false"
                              :picker-options="{start: '06:00',step: '00:05',end: '23:00'}"
                              @change="onTimeChange(scope.row, scope.$index,'startTime')" />
            </template>
          </vx-table-column>
          <vx-table-column label="结束时间">
            <template slot-scope="scope">
              <el-time-select v-model="scope.row.endTime"
                              size="mini"
                              :clearable="false"
                              placeholder="结束时间"
                              :picker-options="{start: '06:00',step: '00:05',end: '23:00'}"
                              @change="onTimeChange(scope.row, scope.$index,'endTime')" />
            </template>
          </vx-table-column>
          <vx-table-column label="走读生进">
            <template slot-scope="scope">
              <span>{{scope.row.outUserJoin==='1'?'允许':"禁止"}}</span>
            </template>
          </vx-table-column>
          <vx-table-column label="走读生出">
            <template slot-scope="scope">
              <span>{{scope.row.outUserLeave==='1'?'允许':"禁止"}}</span>
            </template>
          </vx-table-column>
          <vx-table-column label="住校生进">
            <template slot-scope="scope">
              <span>{{scope.row.insideUserJoin==='1'?'允许':"禁止"}}</span>
            </template>
          </vx-table-column>
          <vx-table-column label="住校生出">
            <template slot-scope="scope">
              <span>{{scope.row.insideUserLeave==='1'?'允许':"禁止"}}</span>
            </template>
          </vx-table-column>
        </vx-table>
      </TabPane>
    </Tabs>
  </Page>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        vRoadGateCategories: [],
        maxHeight: 100,
        loading: true
      }
    },
    computed: {
      scrollerHeight() {
        return this.maxHeight - 5 - 42
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.loading = true
        Api.getRoadgateRule(this.schoolId, this.routeQuery('categoryId')).then(res => {
          if (Check.isRealArray(res.vRoadGateCategories)) {
            res.vRoadGateCategories.some(v => {
              this.vRoadGateCategories.push(
                this.addEntrance(
                  v.vRoadGateManagers
                    ? v
                    : {
                        ...v,
                        ...{ vRoadGateManagers: [] }
                      }
                )
              )
            })
          }
          this.loading = false
        })
      },
      onRemove(row, i) {
        Api.addRoadgateRule({
          vRoadGateManager: {
            ...row,
            ...{ status: 'd' }
          }
        }).then(res => {
          this.vRoadGateCategories[this.$refs._tab.activeKey].vRoadGateManagers.splice(i, 1)
        })
      },
      onCellClick(r, c, j, event, rowIndex) {
        let that = this
        if (c.columnIndex > 2) {
          if (r.startTime === '设置' || r.endTime === '设置') {
            this.$message({ type: 'warning', message: '请先设置开始、结束时间' })
            return
          }
          Api.addRoadgateRule({
            vRoadGateManager: {
              ...r,
              ...{
                outUserJoin: c.columnIndex === 3 ? (r.outUserJoin === '1' ? '0' : '1') : r.outUserJoin,
                outUserLeave: c.columnIndex === 4 ? (r.outUserLeave === '1' ? '0' : '1') : r.outUserLeave,
                insideUserJoin: c.columnIndex === 5 ? (r.insideUserJoin === '1' ? '0' : '1') : r.insideUserJoin,
                insideUserLeave: c.columnIndex === 6 ? (r.insideUserLeave === '1' ? '0' : '1') : r.insideUserLeave
              }
            }
          }).then(res => {
            this.$message({ type: 'success', message: '设置成功' })
            this.$set(that.vRoadGateCategories[that.$refs._tab.activeKey].vRoadGateManagers, rowIndex, res.vRoadGateManager)
          })
        }
      },
      onTimeChange(r, i, j) {
        let that = this
        if (j === 'startTime') {
          if (r.endTime === '设置' || r.startTime === '设置') {
            return
          }
        }
        if (j === 'endTime') {
          if (r.startTime === '设置' || r.startTime === '设置') {
            this.$message({ type: 'warning', message: '开始时间不能为空' })
            return
          }
        }
        try {
          if (new Date(`2019-03-01 ${r.startTime}`).getTime() > new Date(`2019-03-01 ${r.endTime}`).getTime()) {
            this.$message({ type: 'warning', message: '开始时间不能大于结束时间' })
            return
          }
        } catch (e) {
          this.$message({ type: 'warning', message: '时间格式不正确' })
          return
        }
        Api.addRoadgateRule({ vRoadGateManager: r }).then(res => {
          that.$message({ type: 'success', message: '设置成功' })
          that.$set(that.vRoadGateCategories[that.$refs._tab.activeKey].vRoadGateManagers, i, res.vRoadGateManager)
        })
      },
      addEntrance(v) {
        v.vRoadGateManagers.push({
          schoolId: this.schoolId,
          categoryId: this.routeQuery('categoryId'),
          outUserJoin: '1',
          outUserLeave: '1',
          insideUserJoin: '1',
          insideUserLeave: '1',
          weekNum: v.weekNum,
          startTime: '设置',
          endTime: '设置'
        })
        return v
      }
    }
  }
</script>
<style lang="scss">
  .el-input--mini {
    width: rem(120) !important;
    .el-input__inner {
      width: rem(100);
      border: none;
      &:hover,
      &:active {
        background: none;
      }
    }
  }
</style>
