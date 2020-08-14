<template>
  <Page title="联考"
        :showTips="showTips"
        :loading="loading"
        ref="_page">
    <div slot="top"
         v-if="tableData"
         class="table-title"
         v-html="tableData.title"></div>
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
          <template v-if="tab.params.reportType==='2'">
            <vx-table v-if="tableData"
                      :data="tableData.datas"
                      :height="maxHeight"
                      @row-click="rowClick"
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
          </template>
          <template v-else>
            <scroller refId="_chart"
                      :height="maxHeight">
              <Chart v-if="tab.params"
                     :params="tab.params"></Chart>
            </scroller>
          </template>
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
    created() {},
    mixins: [R],
    components: {
      Tabs,
      TabPane,
      Chart: resolve => require(['./Chart'], resolve)
    },
    data() {
      return {
        tabs: [],
        title: '报表',
        tableData: null,
        currentTab: {},
        rH: '0px',
        loading: true,
        maxHeight: 0
      }
    },
    computed: {
      showTips() {
        return this.tabs.length === 0
      }
    },
    methods: {
      fetchData() {
        let that = this
        let groupId = this.routeParam('groupId') || this.groupId
        Api.loadReportTabs('1123', groupId, { ...this.$route.query, version: '2' }).then(res => {
          if (Check.isRealArray(res.tabs)) {
            that.tabs = res.tabs
            let _tab = res.tabs[0]
            that.tabClick({ sourceData: _tab, name: _tab.name })
          }
          this.loading = false
        })
      },
      getReportData(params) {
        let groupId = this.routeParam('groupId') || this.groupId
        this.tableData = null
        Api.loadReportData('1123', groupId, { ...params, version: '2', noTempletReport: 1 }).then(res => {
          this.title = '报表'
          if (res.table) {
            this.tableData = res.table
            if (res.table.params) {
              this.exportObj = res.table.params.excels
            }
          }
        })
      },
      tabClick(nav) {
        if (nav.sourceData) {
          let tp = nav.sourceData.params.reportType
          if (tp === '2') {
            setTimeout(() => {
              this.getReportData(nav.sourceData.params)
            }, 50)
          }
          this.currentTab = nav.sourceData
        }
      },
      rowClick(row) {
        if (row.clickAble == null || row.clickAble === true) {
          this.routePush({
            name: 'report1123',
            params: {
              groupId: row.params.groupId
            },
            query: {
              ...row.params
            }
          })
        }
      }
    },
    activated() {
      this.$nextTick(() => {
        this.maxHeight = this.$refs._page.sh - 52
      })
      this.fetchData()
    },
    watch: {
      '$route.params': {
        deep: true,
        immediate: true,
        handler(n, o) {
          this.tabs = []
          this.fetchData()
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
