<template>
  <page title="分类号">
    <div class="category-title"></div>
    <item v-for="(item, i) in bookTypeList"
          @click="handleSelect(item)"
          :key="i"
          :hasArrow="false">
      <div slot="main"
           v-html="item.typeName"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'

export default {
  mixins: [R],
  data() {
    return {
      bookTypeList: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {},
  methods: {
    fetchData() {
      const that = this
      Api.getBookType().then(res => {
        that.bookTypeList = res.bookTypeList
      })
    },
    handleSelect(item) {
      // this.setStorage('_inscription_cache', item || {})
      this.setStorage('_bookType_cache', item || {})
      this.routeBack()
    }
  }
}
</script>
