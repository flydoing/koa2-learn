<template>
  <page title="选择类型">
    <item v-for="(item,i) in list" :key="i" @click="handleItem(item, i)">
      <div slot="main" v-html="item.name"></div>
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
      list: [{
        name: '病假',
        value: '2'
      }, {
        name: '事假',
        value: '3'
      }]
    }
  },
  computed: {
    ...mapGetters({
      leave: 'getLeave'
    })
  },
  methods: {
    ...mapActions(['setLeave']),
    handleItem(item, index) {
      this.setLeave({ type: item })
      if (item.value !== '3') {
        this.routePush({ name: 'illCondition1235' })
      } else {
        this.setLeave({ IllCondition: null })
        this.routeBack()
      }
    }
  }
}

</script>
