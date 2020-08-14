<template>
  <Page :title="title"
        :showTips="noData">
    <template v-if="exportSize(exportObj)==1">
      <label slot="btn"
             v-for="(item,key) in exportObj"
             :key="key"
             @click="exportClick(item)">{{key}}</label>
    </template>
    <template v-else-if="exportSize(exportObj) > 1"
              slot="btn">
      <el-dropdown trigger="click"
                   @command="exportClick">
        <i class="ico ico-more" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,key) in exportObj"
                            :key="key"
                            :item="item"
                            :command="item">{{key}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <vx-table :data="tableData.datas"
              :height="maxHeight"
              @row-click="handleRow"
              v-if="tableData"
              stripe>
      <template v-if="tableData.columns">
        <vx-table-column width="120"
                         v-for="(item,i) in tableData.columns"
                         :label="item"
                         :key="i"
                         :fixed="i===0 && tableData.columns.length > 4">
          <template slot-scope="scope">
            <span v-html="scope.row.columns[i]"></span>
          </template>
        </vx-table-column>
      </template>
    </vx-table>
  </Page>
</template>
<script>
  'use strict'
  import Api from './api'
  import Cammand from '@/constant/cammand'
  import Tables from '@/components/table/Table'
  import R from './mixin'
  export default {
    created() {
      this.refresh = this.routeParam('refresh')
      this.appType = this.routeQuery('appType')
      this.appName = this.routeQuery('appName') || ''
      this.fromUserId = this.routeQuery('fromUserId')
      this.noTempletReport = this.routeQuery('noTempletReport')
    },
    components: { Tables },
    mixins: [R],
    data() {
      return {
        maxHeight: 200,
        exportObj: {},
        tableData: null,
        noData: false
      }
    },
    computed: {
      title() {
        return `${this.appName}详情`
      }
    },
    methods: {
      fetchData(params = {}) {
        const that = this
        let title = '报表'
        this.tableData = null
        Api.loadReportData({ ...this.$route.query, ...params }).then(res => {
          if (res.table) {
            that.tableData = res.table || {}
            title = res.table.title
            that.noData = false
            if (res.table.params) {
              this.exportObj = res.table.params.excels || {}
            }
          } else {
            that.noData = true
          }
          that.$web.postJsAction({
            type: Cammand.ACTION_TITLE,
            content: title
          })
        })
      },
      exportSize(obj) {
        var count = 0
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            count++
          }
        }
        return count
      },
      exportClick(command) {
        this.openBrowser(command)
      },
      handleRow(row) {
        this.rowClick(row, this.tableData.params || {})
      }
    },
    mounted() {
      this.fetchData()
      // 禁用iOS滚动条
      this.$web.postJsAction({
        type: Cammand.ACTION_SCROLL_ENABLE,
        content: 0
      })
    },
    watch: {
      '$route.params'() {
        this.fetchData()
      }
    }
  }
</script>
