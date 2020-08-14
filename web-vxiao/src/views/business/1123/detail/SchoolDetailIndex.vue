<template>
  <page title="联考">
    <div class="exam-title">{{title}}</div>
    <Tabs theme="theme-1"
          @click="subTabHandle">
      <TabPane v-for="(tab, c) in tabs"
               :key="c"
               v-if="tabs.length>0"
               :label="tab"></TabPane>
    </Tabs>
    <vx-table :data="table.datas"
              :height="scrollerHeight"
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
  </page>
</template>
<script>
  import Api from './detailApi'
  import CardMixin from '@/views/components/card/mixin'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import Tables from '@/components/table/Table'
  export default {
    mixins: [CardMixin],
    components: {
      Tabs,
      TabPane,
      Tables
    },
    data() {
      return {
        maxHeight: 200,
        tabs: [],
        table: {},
        title: ''
      }
    },
    computed: {
      scrollerHeight() {
        let _h = this.maxHeight - 40
        if (this.tabs.length > 1) {
          _h = _h - 42
        }
        return _h
      }
    },
    created() {
      Api.getSchoolTab(this.routeQuery('msgId'), this.currentGroup.groupId).then(res => {
        if (res && res.code === '1') {
          this.tabs = res.subjects
          this.title = res.title
          let defaultSubject = this.tabs[0]
          this.initTable(this.routeQuery('appType'), this.currentGroup.groupId, this.routeQuery('msgId'), defaultSubject)
        }
      })
    },
    methods: {
      initTable(appType, groupId, msgId, queryType) {
        Api.getSubTat({
          appType,
          groupId,
          msgId,
          queryType
        }).then(res => {
          if (res && res.code === '1') {
            this.table = res.table
          }
        })
      },
      subTabHandle(nav, data) {
        this.initTable(this.routeQuery('appType'), this.currentGroup.groupId, this.routeQuery('msgId'), nav.label)
      },
      rowClick(row) {
        this.routePush({
          name: 'examSchoolCardLineChart1123',
          query: {
            pageName: row.columns[0],
            ...row.params
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .exam-title {
    margin-top: rem(10);
    text-align: center;
  }
</style>
