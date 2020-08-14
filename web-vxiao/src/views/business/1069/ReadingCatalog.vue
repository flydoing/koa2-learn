<template>
  <page title="目录">
    <item v-if="list.length>0" v-for="(item, i) in list" @click="itemClick(item)" :key="i">
      <div>{{item.name}}</div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import CatalogApi from '@/views/business/catalog/api'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [R],
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters({
      cacheReading: 'getReading'
    })
  },
  created() {
    CatalogApi.loadCategorys(this.currentGroup.groupId, 0, 1, 1).then(res => {
      this.list = res.categorys
    })
  },
  methods: {
    ...mapActions(['saveReading']),
    itemClick(item) {
      this.saveReading({
        category: item
      })
      this.routeBack()
    }
  }
}

</script>
