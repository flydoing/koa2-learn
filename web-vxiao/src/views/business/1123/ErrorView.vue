<template>
  <page title="联考导入错误数据">
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
      <vx-table v-if="currSheet"
                :data="currSheet.datas"
                :height="maxHeight"
                border>
        <template v-if="currSheet.headers">
          <vx-table-column v-for="(item, i) in currSheet.headers"
                           :key="i"
                           :fixed="i===0 && currSheet.headers.length>4"
                           :label="item"
                           min-width="100">
            <template slot-scope="scope">
              <div v-html="scope.row[i]"></div>
            </template>
          </vx-table-column>
        </template>
      </vx-table>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
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
        sheets: [],
        currSheet: {},
        maxHeight: 0
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        let datas = this.getStorage('exam_import_data')
        this.sheets = datas.map(v => {
          return {
            title: v.properties.title,
            headers: v.headers,
            datas: v.lines
          }
        })
        this.currSheet = this.sheets[0]
      },
      handleTab(item) {
        this.currSheet = item.sourceData
      }
    }
  }
</script>
