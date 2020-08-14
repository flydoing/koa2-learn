<template>
  <Page title="会议"
        :showTips="showTips"
        :loading="loading"
        ref="_page">
    <!-- 导入，导出 -->
    <template v-if="Object.keys(excels).length === 1">
      <label slot="btn"
             v-for="(v,k) in excels"
             :key="k"
             @click="onExport(v)">{{k}}</label>
    </template>
    <template v-else-if="Object.keys(excels).length > 1">
      <el-dropdown slot="btn"
                   trigger="click"
                   @command="onExport">
        <i class="ico ico-more" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,key) in excels"
                            :key="key"
                            :item="item"
                            :command="item">{{key}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <div slot="top"
         class="table-title"
         v-html="tableTitle"></div>
    <div class='report-container'>
      <Tabs @click="tabClick"
            theme="theme-1"
            :showBtns="tabs.length > 1">
        <TabPane v-for="(tab, i) in tabs"
                 :key="i"
                 :label="tab.name"
                 :name="tab.name"
                 :currentData="tab"
                 ref="tabPane">
          <vx-table v-if="tableData"
                    :data="tableData.datas"
                    :height="maxHeight"
                    stripe>
            <template v-if="tableData.columns">
              <vx-table-column width="120"
                               v-for="(item,j) in tableData.columns"
                               :label="item"
                               :key="j"
                               :fixed="j===0 && tableData.columns.length > 4">
                <template slot-scope="scope">
                  <span v-html="scope.row.columns[j]"></span>
                </template>
              </vx-table-column>
            </template>
          </vx-table>
        </TabPane>
      </Tabs>
    </div>
  </Page>
</template>
<script>
  'use strict'
  import Api from './api'
  import R from '@/views/group/mixin'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        tabs: [],
        tableData: null,
        currentTab: {},
        rH: '0px',
        loading: true,
        maxHeight: 0,
        excels: {}
      }
    },
    computed: {
      showTips() {
        return this.tabs.length === 0
      },
      tableTitle() {
        return this.tableData ? this.tableData.title : ''
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        let that = this
        Api.getDetailTabs(this.groupId, this.routeQuery('msgId')).then(res => {
          if (Check.isRealArray(res.tabs)) {
            that.tabs = res.tabs
            let _tab = res.tabs[0]
            that.tabClick({ sourceData: _tab, name: _tab.name })
          }
          this.loading = false
        })
      },
      getReportData(params) {
        this.tableData = null
        Api.getDetailReport(this.groupId, this.routeQuery('msgId'), params.queryType).then(res => {
          if (res.table) {
            if (res.table.params) {
              this.excels = res.table.params.excels || []
            }
            this.tableData = res.table
          }
          this.$nextTick(() => {
            this.maxHeight = this.$refs._page.sh - 52
          })
        })
      },
      onExport(url) {
        this.openBrowser(url)
      },
      tabClick(nav) {
        if (nav.sourceData) {
          setTimeout(() => {
            this.getReportData(nav.sourceData.params)
          }, 50)
          this.currentTab = nav.sourceData
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .table-title {
    @include ct;
    line-height: rem(40);
    border-bottom: $border;
  }
</style>
