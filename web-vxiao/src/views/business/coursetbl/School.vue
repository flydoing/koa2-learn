<template>
  <Page title="课程表"
        :loading="loading"
        class="vx-course-table">
    <!-- 标题（日期时间） -->
    <div class="table-title href-text"
         @click="onChangeDate">
      <i class="ico ico-time" />
      <span>{{timeTitle || ''}}</span>
    </div>
    <template slot="btn">
      <el-dropdown trigger="click"
                   @command="importCourse">
        <label style="color:#FFF;">导入</label>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="0">导入通用课表</el-dropdown-item>
          <el-dropdown-item command="1">导入单周课表</el-dropdown-item>
          <el-dropdown-item command="2">导入双周课表</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <Tabs theme="theme-1"
          @click="tabClick"
          :value="tbValue-1">
      <TabPane key="1"
               label="班级总表"
               :currentData="1">
        <vx-table :data="allTable.datas"
                  stripe
                  border
                  :height="sh">
          <vx-table-column :label="title"
                           v-for="(title,i) in allTable.titles"
                           :key="i"
                           width="150"
                           :fixed="i===0">
            <template slot-scope="scope">
              <template v-if="!scope.row[i]">
                <span>-</span>
              </template>
              <template v-else>
                <template v-for="key in allTable.keys">
                  <div class="course-column"
                       v-if="!!scope.row[i][key]"
                       :key="key"
                       @click="handleCourse(scope.row, scope.$index, i)">
                    {{scope.row[i][key]}}
                  </div>
                </template>
              </template>
            </template>
          </vx-table-column>
        </vx-table>
      </TabPane>
      <TabPane key="2"
               label="任课总表"
               :currentData="2">
        <vx-table :data="rkTable.datas"
                  stripe
                  border
                  :height="sh"
                  @row-click="handleUser">
          <vx-table-column :label="title"
                           v-for="(title,i) in rkTable.titles"
                           :key="i"
                           width="150"
                           :fixed="i===0">
            <template slot-scope="scope">
              <template v-if="!scope.row[i]">
                <span>-</span>
              </template>
              <template v-else>
                <template v-for="key in rkTable.keys">
                  <div v-if="!!scope.row[i][key]"
                       :key="key">
                    {{scope.row[i][key]}}
                  </div>
                </template>
              </template>
            </template>
          </vx-table-column>
        </vx-table>
      </TabPane>
      <TabPane key="3"
               label="场所总表"
               :currentData="3">
        <vx-table :data="placeTable.datas"
                  stripe
                  border
                  :height="sh"
                  @row-click="handlePlace">
          <vx-table-column :label="title"
                           v-for="(title,i) in placeTable.titles"
                           :key="i"
                           width="150"
                           :fixed="i===0">
            <template slot-scope="scope">
              <template v-if="!scope.row[i]">
                <span>-</span>
              </template>
              <template v-else>
                <template v-for="key in placeTable.keys">
                  <div v-if="!!scope.row[i][key]"
                       :key="key">
                    {{scope.row[i][key]}}
                  </div>
                </template>
              </template>
            </template>
          </vx-table-column>
        </vx-table>
      </TabPane>
    </Tabs>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        timeTitle: '',
        allTable: { datas: [], titles: [] },
        rkTable: { datas: [], titles: [] },
        placeTable: { datas: [], titles: [] },
        loading: false,
        maxHeight: '200',
        date: null,
        tbValue: 1
      }
    },
    computed: {
      sh() {
        return this.maxHeight - 82
      }
    },
    created() {
      this.loading = true
      this.fetchData()
    },
    methods: {
      fetchData() {
        let value = this.getStorage('coursetbl_tbValue')
        this.getTableData(value || 1)
      },
      getTableData(value, callback = () => {}) {
        this.tbValue = value
        let date = this.getStorage('coursetbl_date') || this.date || {}
        if (!Check.isNullObject(date)) {
          this.date = date
        }
        Api.loadSchool(this.currentGroup.parentId, date.startTime, date.endTime, value)
          .then(res => {
            this.loading = false
            if (value === 1) {
              this.allTable = res.table || { datas: [], titles: [] }
            } else if (value === 2) {
              this.rkTable = res.table || { datas: [], titles: [] }
            } else if (value === 3) {
              this.placeTable = res.table || { datas: [], titles: [] }
            }
            this.timeTitle = res.table.title || ''
            callback && callback()
          })
          .catch(() => {
            this.loading = false
          })
      },
      tabClick(tab) {
        this.loading = true
        this.getTableData(tab.sourceData)
      },
      onChangeDate() {
        this.routePush({ path: '/vx/group/business/coursetblTime' })
      },
      importCourse(command) {
        let that = this
        let schoolId = this.currentGroup.parentId
        let userId = this.USER.id
        let uri = `/business/coursetable/import?schoolId=${schoolId}&userId=${userId}&alternateType=${command}`
        this.$import({
          title: '导入课表',
          uploadURI: this.uploadURL,
          templateUrl: `/business/coursetable/export/templet?schoolId=${schoolId}`,
          receiptUrl: uri,
          callback: (res, file) => {
            this.$message({ type: 'success', message: '导入成功' })
            that.fetchData()
          },
          receiptBack(res, file) {
            if (res.commonTable) {
              let tbl = res.commonTable
              that.setStorage('_import_receipt', { lines: tbl.lines, headers: tbl.headers })
              that.routePush({
                path: '/vx/group/import/receipt',
                query: {
                  uri: uri,
                  fileId: file.id
                }
              })
            }
          }
        })
      },
      handleCourse(datas, rIndex, cIndex) {
        if (Check.isNullObject(datas[cIndex]) || datas[cIndex].isClick === '0' || cIndex === 0) {
          return false
        }
        this.setStorage('coursetbl_date', this.date)
        this.setStorage('_exchange_course_cache', datas[cIndex])
        this.routePush({
          path: '/vx/group/business/coursetblClass',
          query: {
            groupId: datas[cIndex].groupId,
            title: datas[cIndex].groupName
          }
        })
      },
      handleUser(row, event, column) {
        this.setStorage('coursetbl_date', this.date)
        this.setStorage('coursetbl_tbValue', this.tbValue)
        this.routePush({
          path: '/vx/group/user/course',
          query: {
            userId: row[0].userId,
            title: row[0].courseName
          }
        })
      },
      handlePlace(row, event, column) {
        this.setStorage('coursetbl_date', this.date)
        this.setStorage('coursetbl_tbValue', this.tbValue)
        this.routePush({
          path: '/vx/group/business/coursetblDetail',
          query: {
            placeId: row[0].placeId,
            title: row[0].courseName
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .vx-course-table {
    .table-title {
      @include ct;
      padding: rem(10) rem(0);
      .ico {
        margin-right: rem(5);
      }
    }
    .vx-tab-btns {
      margin-top: rem(0) !important;
    }
    .course-column {
      cursor: pointer;
    }
  }
</style>
