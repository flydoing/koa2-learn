<template>
  <page title="新建宿舍考勤"
        ref="_page">
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
  import { mapGetters, mapActions } from 'vuex'
  // import Check from '@/utils/check'
  import DocApi from '@/views/business/dormitory/api'

  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        tabs: [],
        maxHeight: 0,
        currentTab: null
      }
    },
    computed: {
      ...mapGetters({
        attendance: 'getAttendance'
      })
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setAttendance', 'deleteAttendanceProp']),
      fetchData() {
        let tabs = []
        DocApi.getDormitoryList(this.currentGroup.parentId).then(res => {
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
            this.currentTab = this.attendance.tab || this.tabs[0]
            this.deleteAttendanceProp('tab')
          }
        })
        this.deleteAttendanceProp('dormitory')
      },
      tabClick(nav) {
        if (nav.sourceData) {
          this.currentTab = nav.sourceData
        }
      },
      handleDormitory(item) {
        this.setAttendance({ dormitory: item, tab: this.currentTab })
        this.routePush({
          name: 'result1284',
          query: {
            title: `${item.floorName} - ${item.name}`
          }
        })
      }
    }
  }
</script>
