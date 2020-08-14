<template>
  <page title="场所信息">
    <div slot="top">
      <Tabs @click="handleTab"
            :showBtns="sheets.length > 1"
            theme="theme-1">
        <TabPane v-for="(item,i) in sheets"
                 :key="i"
                 :label="item.title"
                 :name="i"
                 :currentData="item"></TabPane>
      </Tabs>
    </div>
    <div class="place-table">
      <vx-table :data="currSheet.datas"
                :height="tblHeight"
                border>
        <vx-table-column v-for="(item, i) in currSheet.headers"
                         :key="i"
                         :fixed="i===0"
                         :label="item"
                         min-width="100">
          <template slot-scope="scope">
            <div v-html="scope.row[i]"></div>
          </template>
        </vx-table-column>
      </vx-table>
    </div>
    <template slot="bottom">
      <div class="list-button">
        <div class="button"
             @click="handleIgnore">忽略错误继续导入</div>
        <div class="button"
             @click="routeBack()">修改后重新导入</div>
      </div>
    </template>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Tabs from '@/components/tab/Tab'
import TabPane from '@/components/tab/TabPane'
import Api from '../api'

export default {
  mixins: [R],
  components: {
    Tabs,
    TabPane
  },
  data() {
    return {
      sheets: [],
      currSheet: {},
      tblHeight: 0
    }
  },
  created() {
    this.fetchData()
  },
  computed: {},
  methods: {
    fetchData() {
      let datas = this.getStorage('place_import_data')
      this.sheets = datas.map(v => {
        return {
          title: v.properties.title,
          headers: v.headers,
          datas: v.lines
        }
      })
      this.currSheet = this.sheets[0]
      this.$nextTick(() => {
        this.tblHeight = this.$el.children[1].offsetHeight
      })
    },
    handleTab(item) {
      this.currSheet = item.sourceData
    },
    handleIgnore() {
      Api.importPlaceData(this.currentGroup.parentId, this.routeQuery('fileId'), true).then(res => {
        this.routeBack()
      })
    }
  }
}
</script>
