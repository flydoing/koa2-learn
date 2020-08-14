<template>
  <page title="分组评估人">
    <item v-for="(item,i) in list" :key="i" @click="handleGrouping(item)">
      <div slot="main" v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  data() {
    return {
      list: []
    }
  },
  components: {},
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getSuperviseAppraisal'
    })
  },
  methods: {
    ...mapActions(['setSuperviseAppraisal']),
    fetchData() {
      const that = this
      Api.loadSchoolGroupingList(that.currentGroup.parentId).then(res => {
        that.list = res.sgroups || []
      })
    },
    handleGrouping(item) {
      this.setSuperviseAppraisal({ grouping: item })
      this.routePush({ name: 'assessorEdit1170' })
    }
  }
}

</script>
