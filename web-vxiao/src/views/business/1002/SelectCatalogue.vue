<template>
  <page title="选择目录">
    <item v-if="categorys.length>0" v-for="(category, c) in categorys" :key="c" @click="selectCatalog(category)">
      <div>{{category.name}}</div>
    </item>
  </page>
</template>
<script>
  import Api from '@/views/business/catalog/api'
  import G from '@/views/group/mixin'
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        categorys: []
      }
    },
    computed: {
      ...mapGetters({
        cacheHomework: 'getHomework'
      })
    },
    created() {
      Api.loadCategorys(this.currentGroup.groupId, 0).then(res => {
        this.categorys = res.categorys
      })
    },
    methods: {
      ...mapActions(['saveHomework']),
      selectCatalog(category) {
        this.saveHomework({
          ...this.cacheHomework,
          remark: {
            ...this.cacheHomework.remark,
            categoryId: category.id,
            categoryName: category.name
          }
        })
        this.routeBack()
      }
    }
  }

</script>
