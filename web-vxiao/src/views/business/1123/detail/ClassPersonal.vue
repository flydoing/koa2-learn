<template>
  <page :title="pageName">
    <Tabs :showBtns="tabs.length > 1"
          @click="tabHandle">
      <TabPane :label="tab.name"
               v-if="tabs.length>0"
               v-for="(tab, t) in tabs"
               :key="t"
               :currentData="tab">
        <div class="school-exam-detail-title">{{tab.params.title}}</div>
        <Tabs theme="theme-1"
              @click="subTabHandle">
          <TabPane v-for="(child, c) in tab.children"
                   :key="c"
                   v-if="tab.children&&tab.children.length>0"
                   :label="child.name"
                   :currentData="child"></TabPane>
        </Tabs>
      </TabPane>
    </Tabs>
    <Tables :tableData="datas" />
  </page>
</template>
<script>
  import DetailApi from './detailApi'
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
        maxHeight: 100,
        tabs: [],
        tableData: {},
        pageName: this.routeQuery('pageName') || '联考'
      }
    },
    created() {
      this.initPage(this.routeQuery('appType'), this.currentGroup.groupId, this.routeQuery('msgId'), '', this.$route.query)
    },
    methods: {
      initPage(appType, groupId, msgId, queryType, args) {
        DetailApi.getMainTab({
          appType,
          groupId,
          msgId,
          ...args
        }).then(res => {
          if (res && res.code === '1') {
            this.tabs = res.tabs
            this.tabs.forEach((tab, t) => {
              t === 0 ? (tab.active = 1) : (tab.active = 0)
            })
            DetailApi.getSubTat({
              appType,
              groupId,
              msgId,
              queryType: queryType || this.tabs[0].children[0].name,
              ...args
            }).then(response => {
              if (response && response.code === '1') {
                this.tableData = response.table
              }
            })
          }
        })
      },
      tabHandle(nav, sourseDatas) {
        if (nav.label === '图表') {
          delete sourseDatas.params.url
          this.routePush({
            name: 'examClassCardLineChart1123',
            query: {
              ...sourseDatas.params
            }
          })
        }
      },
      subTabHandle(nav, data) {
        this.initPage(this.routeQuery('appType'), this.currentGroup.groupId, this.routeQuery('msgId'), nav.label, this.$route.query)
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .school-exam-detail-title {
    padding-top: rem(10);
    text-align: center;
  }
</style>
