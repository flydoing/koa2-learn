<template>
  <page title="招生方案"
        closePrompt>
    <item v-for="(item, i) in list"
          :key="i"
          :label="item.title"
          @click="handleCase(item)"
          :hasArrow="false">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      Api.getCases(this.schoolId).then(res => {
        this.list = res.forms || []
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      handleCase(item) {
        this.setCreateObject({ case: item })
        this.routeBack()
      }
    }
  }
</script>
