<template>
  <Page :title="title"
        :showTips="showTips"
        :loading="loading"
        @back="onBack"
        listenBack
        ref="_page"
        class="report-container">
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
    <div v-for="(_page,i) in pageTabs"
         v-show="i === activeIndex"
         :key="_page.templetId">
      <!-- 标题（日期时间） -->
      <div class="table-title href-text"
           v-if="!isLevelGt"
           @click="onChangeDate">
        <i class="ico ico-time"
           v-if="_page.tabTitle" />
        <span>{{pageTab.tabTitle}}</span>
      </div>
      <!-- 一级选项卡 -->
      <Tabs theme="theme-1"
            @click="onTabClick"
            ref="_tab"
            :showBtns="_page.tabs.length > 1"
            :value="pageTab.value">
        <TabPane v-for="tab in _page.tabs"
                 :key="tab.name"
                 :label="tab.name"
                 :name="tab.value"
                 :currentData="tab">
          <!-- 排行榜 -->
          <ReportRank v-if="tab.reportType==='1'"
                      :tab="_page.historyReport[tab.id]"
                      :maxHeight="scrollerHeight"
                      @click="rowClick" />
          <!-- 表格报表 -->
          <ReportTable v-else-if="tab.reportType==='2'"
                       :tab="_page.historyReport[tab.id]"
                       :maxHeight="reportHeight"
                       @click="rowClick" />
          <!-- 图形报表 -->
          <ReportChart v-else-if="tab.reportType==='3' && tab.templetType==='1150_2_5_2'"
                       :tab="tab"
                       :params="_page.queryData"
                       :groupId="_page.queryData.groupId"
                       :maxHeight="scrollerHeight" />
          <ReportChart v-else-if="tab.reportType==='3' && tab.templetType==='1150_2_5_3'"
                       :tab="tab"
                       :params="_page.queryData"
                       :groupId="_page.queryData.groupId"
                       :maxHeight="scrollerHeight" />
          <ReportChart v-else-if="tab.reportType==='3' && tab.id"
                       :tab="_page.historyReport[tab.id]"
                       :params="_page.queryData"
                       :groupId="_page.queryData.groupId"
                       :maxHeight="scrollerHeight" />
          <!-- 自定义 -->
          <ReportCustom v-else
                        :tab="_page.historyReport[tab.id]"
                        :params="_page.customParams"
                        :maxHeight="scrollerHeight" />
          <!-- 报表描述 -->
          <Description :tab="tab" />
        </TabPane>
      </Tabs>
    </div>
    <div class="vx-report-image"
         v-if="imageUrl"
         v-viewer="{movable: false}">
      <img :src="imageUrl"
           :key="imageUrl" />
    </div>
    <!-- <div class="vx-report-image"
         v-if="imageUrl!==''">
      <img :data-source="imageUrl"
           :src="imageUrl" />
    </div> -->
  </Page>
</template>
<script>
  import Api from './api'
  import R from './mixin'
  import Check from '@/utils/check'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane,
      ReportTable: resolve => require(['./commons/Table'], resolve),
      ReportChart: resolve => require(['./commons/Chart'], resolve),
      ReportRank: resolve => require(['./commons/Rank'], resolve),
      ReportCustom: resolve => require(['./commons/Custom'], resolve),
      Description: resolve => require(['./ReportDescription'], resolve)
    },
    data() {
      return {
        pageTabs: [
          {
            tabs: [],
            title: '报表',
            tabTitle: '',
            templetId: '',
            level: '',
            customParams: null,
            historyTab: null,
            historyReport: {},
            queryData: {}
          }
        ],
        excels: {},
        loading: true,
        showTips: false,
        imageUrl: '',
        maxHeight: 100
      }
    },
    computed: {
      activeIndex() {
        return this.pageTabs.length - 1
      },
      reportHeight() {
        let tab = this.pageTab.historyTab || {}
        if (tab.templetType === '10040_2_1') {
          return 'auto'
        }
        return this.scrollerHeight
      },
      scrollerHeight() {
        let _h = this.maxHeight - 40
        if (this.pageTab.tabs.length > 1) {
          _h = _h - 42
        }
        return _h
      },
      pageTab() {
        return this.pageTabs[this.activeIndex]
      },
      title() {
        return this.pageTab.title || '报表'
      },
      isLevelGt() {
        return this.pageTab.queryData && (this.pageTab.queryData.level === '2' || this.pageTab.queryData.level === '3')
      }
    },
    activated() {
      // 清楚自定义时间缓存
      this.getStorage('_change_date_start')
      this.getStorage('_change_date_end')

      this.pageTab.queryData = {
        ...this.pageTab.queryData,
        ...(this.getStorage('_change_date') || {})
      }
      let isRefresh = this.getStorage('_report_detail_refresh') || false
      if (isRefresh || !Check.isRealArray(this.pageTab.tabs) || !this.pageTab.historyTab) {
        this.getTabs(isRefresh)
      } else {
        this.getTemplateReport(this.pageTab.historyTab, true)
      }
    },
    methods: {
      onExport(url) {
        this.openBrowser(url)
      },
      getTabs(isRefresh) {
        this.groupId = this.routeQuery('groupId') || this.routeParam('groupId')
        this.appType = this.routeQuery('appType')
        let templetId = this.pageTab.templetId || ''
        let level = this.pageTab.queryData.level || ''
        Api.loadTabs(this.groupId, this.appType, templetId, level).then(res => {
          if (Check.isRealArray(res.tabs)) {
            this.$set(this.pageTab, 'tabs', res.tabs[0].templets || [])
            if (isRefresh) {
              this.$set(this.pageTab, 'queryData', {})
              this.$nextTick(() => {
                this.$refs._tab[0].tabClick(null, 0)
              })
            } else {
              this.onTabClick({ sourceData: this.pageTab.tabs[0] })
            }
          }
          this.loading = false
        })
      },
      onTabClick(tab) {
        this.pageTab.historyTab = tab.sourceData
        // 如果报表类型是图标或者自定义，则不需要走通用的查报表的接口
        if (this.pageTab.historyTab.reportType !== '1' && this.pageTab.historyTab.reportType !== '2') {
          this.pageTab.customParams = {
            ...this.$route.query,
            ...this.pageTab.queryData,
            groupId: this.groupId,
            templetId: this.pageTab.historyTab.id
          }
          this.$set(this.pageTab.historyReport, this.pageTab.historyTab.id, tab.sourceData)
          return
        }

        this.getTemplateReport(this.pageTab.historyTab, true)
      },
      getTemplateReport(tab, reload) {
        if (!reload && this.pageTab.historyReport[tab.id]) {
          return
        }
        this.loading = true
        Api.loadReportData({
          templetId: tab.id,
          groupId: this.groupId,
          ...this.$route.query,
          ...this.pageTab.queryData
        }).then(res => {
          this.loading = false
          let _table = res.table || { params: {}, subTitle: '' }
          this.$set(this.pageTab.historyReport, tab.id, {
            table: _table,
            ...tab
          })
          this.pageTab.tabTitle = _table.subTitle || ''
          if (_table.params) {
            this.excels = _table.params.excels || []
          } else {
            this.excels = []
          }
        })
      },
      onChangeDate(command) {
        if (!this.routeQuery('timeType')) return // 查看详细没有timeType 不给跳转
        this.routePush({
          name: 'reportDateChange',
          query: {
            groupId: this.groupId,
            appType: this.appType,
            timeType: this.routeQuery('timeType')
          }
        })
      },
      onBack() {
        this.imageUrl = ''
        if (this.pageTabs.length > 1) {
          this.pageTabs.splice(this.pageTabs.length - 1, 1)
        } else {
          this.routeBack()
        }
      }
    },
    watch: {
      pageTab(v) {
        this.$nextTick(() => {
          if (!Check.isRealArray(v.tabs) || !v.historyTab) {
            this.getTabs()
          } else {
            this.getTemplateReport(v.historyTab)
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .report-container {
    .theme-1 {
      margin-top: 5px;
    }
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
    .el-tabs__content {
      padding: rem(0) !important;
    }
    .vx-report-image {
      @include ct;
      position: absolute;
      opacity: 0;
      z-index: -1;
      top: 0;
      left: 0;
    }
  }
</style>
