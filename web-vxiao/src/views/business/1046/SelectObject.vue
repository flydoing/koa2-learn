<template>
  <page :title="title"
        :hasAdd="hasAdd"
        @Add="handleAdd"
        :loading="loading">
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索"
             v-model="keyword" />
    </Item>

    <Tabs @click="handleTab"
          ref="_tab"
          :showBtns="tabs.length > 1"
          :value="curTab.value">
      <TabPane v-for="tab in tabs"
               :key="tab.name"
               :label="tab.name"
               :name="tab.value"
               :currentData="tab">
        <scroller :height="scrollerHeight">
          <item v-for="(item,i) in results"
                :key="i"
                @click="handleItem(item, i)"
                :label="item.name">
          </item>
        </scroller>
      </TabPane>
    </Tabs>

  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api1079 from '@/views/business/1079/api'
  import Api1062 from '@/views/business/1062/api'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        tabs: [
          {
            name: '客户',
            value: 'customer',
            selected: true
          },
          {
            name: '代理商',
            value: 'agent',
            selected: false
          }
        ],
        results: [],
        list: [],
        keyword: '',
        maxHeight: 0,
        params: {},
        loading: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      title() {
        return this.routeQuery('title') || ''
      },
      hasAdd() {
        return this.params.hasAdd || false
      },
      curTab() {
        return this.tabs.filter(v => {
          return v.selected
        })[0]
      },
      scrollerHeight() {
        let _h = this.maxHeight
        if (this.tabs.length > 1) {
          _h = _h - 42
        }
        return _h
      }
    },
    methods: {
      ...mapActions(['setCrm']),
      fetchData() {
        let tab = this.getStorage('_agent_customer_select_tab_cache')
        if (tab) {
          this.tabs = this.tabs.map(v => {
            if (tab.value === v.value) {
              return tab
            }
            return v
          })
        }
        this.getDatas(this.curTab.value)
      },
      getDatas(value) {
        this.results = []
        this.list = []
        this.loading = true
        if (value === 'agent') {
          Api1079.getAgents(this.groupId).then(res => {
            if (res.datas && !Check.isNullString(this.keyword)) {
              let datas = res.datas.filter(v => {
                return v.name.indexOf(this.keyword) !== -1
              })
              this.results = this.list = datas
            } else {
              this.results = this.list = res.datas || []
            }
            this.loading = false
          })
        } else {
          Api1062.getCustomers(this.groupId).then(res => {
            if (res.clients && !Check.isNullString(this.keyword)) {
              let clients = res.clients.filter(v => {
                return v.name.indexOf(this.keyword) !== -1
              })
              this.results = this.list = clients
            } else {
              this.results = this.list = res.clients || []
            }
            this.loading = false
          })
        }
      },
      handleTab(item) {
        this.tabs = this.tabs.map(v => {
          v.selected = v.value === item.sourceData.value
          return v
        })
        this.getDatas(item.sourceData.value)
      },
      handleItem(item, index) {
        if (this.curTab.value === 'agent') {
          this.setCrm({ agent: item })
        } else {
          this.setCrm({ customer: item })
        }
        this.routeBack()
      },
      handleAdd() {}
    },
    watch: {
      keyword(val) {
        if (Check.isNullString(val)) {
          this.results = [...this.list]
          return false
        }
        if (Check.isRealArray(this.list)) {
          this.results = this.list.filter(v => {
            return v.name.indexOf(val) !== -1
          })
        }
      }
    }
  }
</script>
