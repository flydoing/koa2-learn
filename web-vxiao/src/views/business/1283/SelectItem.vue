<template>
  <page title="选择项目">
    <item v-for="(v,i) in list"
          :key="i"
          :v="v"
          :hasArrow="false"
          @click="handleSelect(v, i)"
          :label="v.name">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.initData()
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      })
    },
    methods: {
      ...mapActions(['setRating']),
      initData() {
        this.list = [...this.rating.items]
      },
      handleSelect(item, index) {
        this.setRating({ curItem: item })
        this.routeBack()
      }
    },
    watch: {}
  }
</script>
