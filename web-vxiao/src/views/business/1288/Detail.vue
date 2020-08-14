<template>
  <Page title="报表"
        :showTips="showTips"
        :loading="loading"
        ref="_page">
    <div slot="top"
         class="table-title"
         v-html="tableTitle"></div>
    <div class='report-container'>
      <div class="reportDate">{{reportDate}}</div>
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
  // import Check from '@/utils/check'

  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        tabs: [{ name: '水表' }, { name: '电表' }],
        tableData: null,
        currentTab: {},
        rH: '0px',
        loading: true,
        maxHeight: 0,
        reportDate: ''
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
      if (this.routeQuery('reportDate')) {
        let reportDate = this.routeQuery('reportDate').split('：')
        this.reportDate = reportDate[1].replace('用电', '')
      } else {
        this.reportDate = this.routeQuery('dateFullName')
      }

      this.getReportData('water')
    },
    methods: {
      getReportData(type) {
        this.tableData = null
        const appType = this.routeQuery('appType')
        const noTempletReport = this.routeQuery('noTempletReport')
        // const fromUserId = this.routeQuery('fromUserId')
        // const appName = this.routeQuery('appName')
        const date = this.routeQuery('date')
        const meterType = type
        Api.getReportDetail(appType, this.groupId, noTempletReport, date, meterType).then(res => {
          console.log(res, 'res')
          if (res.table) {
            this.tableData = res.table
            this.loading = false
          }
          this.$nextTick(() => {
            this.maxHeight = this.$refs._page.sh - 52
          })
        })
      },
      tabClick(item) {
        if (item.name === '电表') {
          this.getReportData('power')
        } else {
          this.getReportData('water')
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
  .reportDate {
    height: rem(40);
    line-height: rem(40);
    text-align: center;
  }
</style>
