<template>
  <Page title="选择评估方案">
    <div class="case-list">
      <item v-for="(item, i) in list" :key="i" @click="handleItem(item)">
        <div slot="main" v-html="item.title"></div>
      </item>
    </div>
  </Page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Api from './api'
import R from '@/views/group/mixin'

export default {
  mixins: [R],
  components: {},
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters({
      appraisal: 'getTeacherAppraisal'
    })
  },
  created() {
    this.fetchData()
  },
  methods: {
    ...mapActions(['setTeacherAppraisal']),
    fetchData() {
      const that = this
      Api.loadCaseList(that.currentGroup.groupId).then(res => {
        that.list = res.projectList || []
      })
    },
    handleItem(item) {
      this.setTeacherAppraisal({ aplCase: item })
      this.routeBack()
    }
  }
}

</script>
