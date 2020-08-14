<template>
  <Tabs theme="theme-1"
        @click="tabClick"
        :showBtns="tabs.length > 1">
    <TabPane v-for="tab in tabs"
             :key="tab.name"
             :label="tab.name"
             :name="tab.name"
             :currentData="tab">
      <vx-table :data="table.datas"
                :height="maxHeight"
                @row-click="rowClick"
                stripe>
        <vx-table-column width="120"
                         v-for="(item,i) in table.columns"
                         :label="item"
                         :key="i"
                         :fixed="i===0 && table.columns.length > 4">
          <template slot-scope="scope">
            <span v-html="scope.row.columns[i]"></span>
          </template>
        </vx-table-column>
      </vx-table>
    </TabPane>
  </Tabs>
</template>
<script>
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import Tables from '@/components/table/Table'
  import Api from './api'
  export default {
    created() {
      if (this.routeQuery('tokenId')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('tokenId')
      }
      if (this.routeQuery('clientId')) {
        this.$http.defaults.headers.common['ClientId'] = this.routeQuery('clientId')
      }
      const that = this
      Api.loadTabs(this.$route.query).then(res => {
        that.tabs = res.tabs
      })
    },
    components: { Tabs, TabPane, Tables },
    computed: {},
    data() {
      return {
        maxHeight: 100,
        tabs: [],
        table: {},
        title: ''
      }
    },
    methods: {
      tabClick(tab, srcTab) {
        const that = this
        that.title = srcTab.params.title
        Api.loadReport(srcTab.params).then(res => {
          that.table = res.table
        })
      },
      rowClick(r) {
        if (r.forward === 'list') {
        } else if (r.forward === 'table') {
        }
      }
    }
  }
</script>
