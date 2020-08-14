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
  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      CatalogApi.loadCategorys(this.currentGroup.groupId, 0, 1, 1).then(res => {
        this.list = res.categorys
      })
    },
    methods: {
      itemClick(item) {
        this.setStorage('resourcesCatorye', item)
        this.routeBack()
      }
    }
  }

</script>
