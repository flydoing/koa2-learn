<template>
  <page title="目录">
    <item v-if="categorys.length>0" v-for="(category, c) in categorys" :key="c" @click="itemClick(category)">
      <div>{{category.name}}</div>
    </item>
  </page>
</template>
<script>
  import Api from './api'
  import G from '@/views/group/mixin'
  import {
    mapActions
  } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        categorys: []
      }
    },
    created() {
      Api.getResourceCatalogues({
        groupId: this.currentGroup.groupId,
        isGlobal: 1,
        isSerial: 1
      }).then(res => {
        this.categorys = [...res.categorys]
      })
    },
    methods: {
      ...mapActions(['saveClassRoomCreate']),
      itemClick(category) {
        this.saveClassRoomCreate({
          category: category
        })
        this.routeBack()
      }
    }
  }

</script>
