<template>
  <page title="值日设置">
    <div class="duty-setting">
      <item>
        <div slot="main">区分单双周</div>
        <div slot="after">
          <i-switch :value="isSwitch"
                    @click="handleSwitch"></i-switch>
        </div>
      </item>
      <item v-if="isSwitch"
            class="ds-start-time"
            :hasClick="false">
        <div slot="main">单周开始时间</div>
        <div slot="after">
          <el-date-picker v-model="startTime"
                          prefix-icon="x"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"
                          @change="handleTime"></el-date-picker>
        </div>
      </item>
      <div class="category-title"></div>
      <Tabs v-if="isSwitch"
            @click="handleType"
            :showBtns="dutyTable.types.length > 1"
            :value="typeValue">
        <TabPane v-for="(item,i) in dutyTable.types"
                 :key="i"
                 :label="item.name"
                 :name="i"
                 :currentData="item"></TabPane>
      </Tabs>
      <Tabs @click="handleCampus"
            :showBtns="dutyTable.campuses.length > 1"
            theme="theme-1"
            :value="campusValue">
        <TabPane v-for="(item,i) in dutyTable.campuses"
                 :key="i"
                 :label="item.name"
                 :name="i"
                 :currentData="item"></TabPane>
      </Tabs>
      <Table :tableData="table"
             @cellClick="cellClick"></Table>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import CategoryApi from '@/api/category'
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
      Table: resolve => require(['@/components/table/Table'], resolve)
    },
    props: {},
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas',
        onDuty: 'getOnDuty'
      }),
      oddWeekMeta() {
        let meta = this.metaDatas.filter(m => {
          return m.metaType === 'm_rating_oddweeks' && m.extension === this.currentGroup.groupId
        })[0]
        return meta
      },
      isSwitch() {
        return this.oddWeekMeta && this.oddWeekMeta.status !== 'd'
      },
      typeValue() {
        let type = this.dutyTable.types.filter(v => {
          return v.selected
        })[0]
        return type ? type.index : 0
      },
      campusValue() {
        let campus = this.dutyTable.campuses.filter(v => {
          return v.selected
        })[0]
        return campus ? campus.index : 0
      }
    },
    data() {
      return {
        table: {
          lockRows: 1,
          lockColumns: 1,
          columns: [],
          datas: []
        },
        tableData: {
          datas: []
        },
        dutyTable: {
          campuses: [],
          types: []
        },
        startTime: ''
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setOnDuty', 'modifyMetaData']),
      fetchData() {
        const that = this
        if (that.oddWeekMeta) {
          that.startTime = that.oddWeekMeta.obj
        }
        if (that.onDuty.dutyTable) {
          that.dutyTable = that.onDuty.dutyTable
          that.loadTableData()
        } else {
          GroupApi.getSchoolCampus(that.currentGroup.parentId).then(res => {
            res.groups.forEach((v, i) => {
              that.dutyTable.campuses.push({ ...v, selected: i === 0, index: i })
            })
            that.loadTableData()
          })
          if (that.isSwitch) {
            CategoryApi.getCategorysByType('122').then(res => {
              res.categorys.forEach((v, i) => {
                that.dutyTable.types.push({ ...v, selected: i === 0, index: i })
              })
            })
          }
        }
      },
      loadTableData() {
        const that = this

        let campus = that.dutyTable.campuses.filter(v => {
          return v.selected
        })[0]
        let isOddWeek = ''
        if (that.isSwitch) {
          let type = that.dutyTable.types.filter(v => {
            return v.selected
          })[0]
          isOddWeek = type ? type.value : '1'
        }

        Api.getDutyTableData(that.currentGroup.parentId, campus.groupId, isOddWeek).then(res => {
          // 表格对象数据
          let objDatas = []
          let datas = []
          let headers = []

          if (Check.isArray(res.dataTables)) {
            headers = res.dataTables[0].tableTitle
            res.dataTables[0].datas.forEach((v, i) => {
              let objSets = [{ id: v.id, name: v.name, type: v.type, groupId: v.groupId }]
              let set = { columns: [], clickAble: false, isSummary: false }
              set.columns.push(v.name)

              for (let item in v.mapUsers) {
                let txt =
                  v.mapUsers[item].length > 0
                    ? v.mapUsers[item]
                        .map(u => {
                          return u.name
                        })
                        .join('，')
                    : '设置'
                set.columns.push(txt.length > 10 ? `${txt.substring(0, 10)}...` : txt)
                objSets.push({ id: item, name: txt, users: v.mapUsers[item], gradeId: v.id, gradeType: v.type, groupId: v.groupId })
              }

              datas.push(set)
              objDatas.push(objSets)
            })
          }

          that.table.datas = datas
          that.table.columns = headers
          that.tableData.datas = objDatas
        })
      },
      handleSwitch() {
        let meta = this.oddWeekMeta ? { ...this.oddWeekMeta } : null
        if (meta && meta.status !== 'd') {
          meta.status = 'd'
        } else if (meta && meta.status === 'd') {
          meta.status = '1'
          meta.obj = this.startTime
        } else {
          meta = {
            extension: this.currentGroup.groupId,
            metaType: 'm_rating_oddweeks',
            key: '1',
            obj: this.startTime,
            status: 1
          }
        }
        this.modifyMetaData(meta).then(res => {
          this.loadTableData()
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleCampus(item) {
        this.dutyTable.campuses = this.dutyTable.campuses.map(v => {
          v.selected = v.id === item.sourceData.id
          return v
        })
        this.loadTableData()
      },
      handleType(item) {
        this.dutyTable.types = this.dutyTable.types.map(v => {
          v.selected = v.id === item.sourceData.id
          return v
        })
        this.loadTableData()
      },
      handleTime(time) {
        let meta = this.oddWeekMeta
        if (meta) {
          meta.obj = time || ''
        } else {
          meta = {
            extension: this.currentGroup.groupId,
            metaType: 'm_rating_oddweeks',
            key: '1',
            obj: time || '',
            status: 1
          }
        }
        this.modifyMetaData(meta).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      cellClick(cell, columnIndex, rowIndex) {
        let tbl = this.tableData.datas
        let obj = tbl[rowIndex][columnIndex]

        if (!obj) {
          return false
        }

        let type = this.dutyTable.types.filter(v => {
          return v.selected
        })[0]
        this.setOnDuty({ dutyItem: obj, dutyTable: this.dutyTable, type: type, isOddWeek: this.isSwitch, users: [] })
        this.routePush({ name: 'memberList1049' })
      }
    }
  }
</script>
<style lang="scss">
  .duty-setting {
    .t-cell {
      cursor: pointer;
    }
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .ds-start-time input {
      min-width: initial !important;
    }
  }
</style>
