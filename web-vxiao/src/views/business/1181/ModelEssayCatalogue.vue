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
        cacheEssay: 'getEssayCreate'
      })
    },
    created() {
      Api.loadCategorys(this.currentGroup.groupId, 0).then(res => {
        this.categorys = res.categorys
      })
    },
    methods: {
      ...mapActions(['saveEssayCreate']),
      selectCatalog(category) {
        this.saveEssayCreate({
          ...this.cacheEssay,
          category: category
        })
        this.routeBack()
      }
    }
  }

</script>
