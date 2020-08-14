<template>
  <page title="宿舍"
        ref="_page">
    <el-dropdown slot="btn"
                 trigger="click"
                 @command="handleOperate">
      <i class="ico ico-more" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item,i) in operates"
                          :key="i"
                          :item="item"
                          :command="item">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class='report-container'>
      <Tabs v-if="currentTab"
            @click="tabClick"
            theme="theme-1"
            :showBtns="tabs.length > 1"
            :value="currentTab.name">
        <TabPane v-for="(tab, i) in tabs"
                 :key="i"
                 :label="tab.name"
                 :name="tab.name"
                 :currentData="tab"
                 ref="tabPane">
          <scroller :height="maxHeight">
            <div v-for="(item, i) in tab.buildings"
                 :key="i"
                 class="each-building">
              <div class="category-title text"
                   v-html="item.name"></div>
              <item v-for="(dor, j) in item.dormitorys"
                    :key="j"
                    @click="handleDormitory(dor)">
                <div slot="main">{{dor.name}}（{{dor.floorNum}}）</div>
                <div slot="remark">{{dor.count}}</div>
              </item>
            </div>
          </scroller>
        </TabPane>
      </Tabs>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  // import Check from '@/utils/check'
  import Api from './api'

  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        tabs: [],
        maxHeight: 200,
        currentTab: null,
        operates: [
          {
            name: '导入',
            value: 1
          },
          {
            name: '导出',
            value: 2
          }
        ]
      }
    },
    computed: {},
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.setStorage('_dormitory_cache')
        let tabs = []
        Api.getDormitoryList(this.currentGroup.parentId).then(res => {
          if (res.dormitoryPlaceList) {
            res.dormitoryPlaceList.forEach((v, i) => {
              let dMap = new Map()
              v.placeList.map(p => {
                let floor = dMap.get(p.floorName)
                if (floor) {
                  floor.dormitorys.push(p)
                  dMap.set(p.floorName, floor)
                } else {
                  dMap.set(p.floorName, {
                    name: p.floorName,
                    dormitorys: [p]
                  })
                }
              })

              let buildings = []
              dMap.forEach((v, k, i) => {
                buildings.push(v)
              })

              tabs.push({
                id: v.cId,
                name: v.name,
                buildings: buildings,
                index: i
              })
            })

            this.tabs = tabs
            if (this.tabs.length > 1) {
              this.$nextTick(() => {
                this.maxHeight = this.$refs._page.sh - 52
              })
            }
            let tab = this.getStorage('_dormitory_tab')
            this.currentTab = tab || this.tabs[0]
          }
        })
      },
      tabClick(nav) {
        if (nav.sourceData) {
          this.currentTab = nav.sourceData
        }
      },
      handleDormitory(item) {
        this.setStorage('_dormitory_cache', item)
        this.setStorage('_dormitory_tab', this.currentTab)
        this.routePush({
          path: '/vx/group/business/dormitory/addMember',
          query: {
            dId: item.id,
            cId: item.cid,
            title: `${item.floorName} - ${item.name}`
          }
        })
      },
      handleOperate(item) {
        let that = this
        this.setStorage('_dormitory_tab', this.currentTab)
        if (item.value === 1) {
          let uri = `/business/dormitory/user/import?schoolId=${this.currentGroup.parentId}`
          this.$import({
            title: '导入宿舍成员',
            uploadURI: this.uploadURL,
            templateUrl: `/static/templates/basice_dormitory.xlsx`,
            receiptUrl: uri,
            callback: (res, file) => {
              that.$message({ type: 'success', message: '操作成功' })
              that.fetchData()
            },
            receiptBack(res, file) {
              if (res.commonTables) {
                let tbl = res.commonTables[0]
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
        } else {
          this.openBrowser(`/business/dormitory/user/exportTemplet/${this.currentGroup.parentId}`)
        }
      }
    }
  }
</script>
