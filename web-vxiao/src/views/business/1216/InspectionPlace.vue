<template>
  <page title="巡检地点"
        @submit="handleSubmit"
        hasSubmit>
    <Tabs @click="handleCampus"
          :showBtns="campuses.length > 1"
          theme="theme-1">
      <TabPane v-for="(item,i) in campuses"
               :key="i"
               :label="item.name"
               :name="i"
               :currentData="item"></TabPane>
    </Tabs>
    <div v-for="(item, i) in curCampus.places"
         :key="i">
      <div class="category-title text"
           v-html="item.name"></div>
      <item v-for="(child, j) in item.childs"
            :key="j"
            :hasArrow="false"
            @click="handleSelect(child)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':child.active}"></i>
        </div>
        <div slot="main"
             v-html="child.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        campuses: [],
        curCampus: {
          places: []
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    components: { Tabs, TabPane },
    methods: {
      fetchData() {
        const that = this
        Api.loadPlaceList(that.currentGroup.parentId).then(res => {
          for (let campus in res.placeMap) {
            let places = res.placeMap[campus].map(v => {
              v.childs = v.childs.map(c => {
                c.active = c.isSelect === '1'
                return c
              })
              return v
            })
            that.campuses.push({ name: campus, places: places })
          }
          that.curCampus = that.campuses[0]
        })
      },
      handleSelect(item) {
        this.curCampus.places = this.curCampus.places.map(v => {
          v.childs = v.childs.map(c => {
            c.placeId === item.placeId && (c.active = !item.active)
            return c
          })
          return v
        })
      },
      handleCampus(item) {
        this.campuses = this.campuses.map(v => {
          v.name === this.curCampus.name && (v = this.curCampus)
          return v
        })
        this.curCampus = item.sourceData
      },
      handleSubmit() {
        const that = this

        let places = []
        that.campuses.map(v => {
          v.places.map(p => {
            let pls = p.childs.filter(c => {
              return c.active
            })
            places.push(...pls)
          })
        })

        if (!Check.isRealArray(places)) {
          that.$message({ type: 'warning', message: '请选择巡检地点' })
          return false
        }

        places = places.map(v => {
          return { placeId: v.placeId, schoolId: that.currentGroup.parentId }
        })
        Api.commitPlaces(places).then(res => {
          that.$message({ type: 'success', message: '操作成功' })
          that.routeBack()
        })
      }
    }
  }
</script>
