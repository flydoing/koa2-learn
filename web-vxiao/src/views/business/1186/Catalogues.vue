<template>
  <page title="目录">
    <item v-for="(category, c) in categorys"
          :key="c"
          @click="handleCategory(category)">
      <div slot="main">{{category.name}}</div>
    </item>
  </page>
</template>
<script>
  import Api from './api'
  import G from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        categorys: []
      }
    },
    computed: {
      ...mapGetters({
        chant: 'getChant'
      })
    },
    created() {
      Api.getCetagory(this.currentGroup.groupId, 1, 1).then((res) => {
        this.categorys = res.categorys || []
      })
    },
    methods: {
      ...mapActions(['setChant']),
      handleCategory(category) {
        this.setChant({ category: category })
        this.routeBack()
      }
    }
  }
</script>
