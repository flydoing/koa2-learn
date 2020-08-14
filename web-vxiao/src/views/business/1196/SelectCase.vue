<template>
  <Page title="选择评估方案">
    <div class="case-list">
      <item v-for="(item, i) in list" :key="i" @click="handleItem(item)" v-if="item.name">
        <div slot="main">
          <div v-html="item.name"></div>
          <div class="remark-txt" v-html="item.description"></div>
        </div>
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
      appraisal: 'getStudentAppraisal'
    })
  },
  created() {
    this.fetchData()
  },
  methods: {
    ...mapActions(['setStudentAppraisal']),
    fetchData() {
      const that = this
      Api.loadTemplateList(that.currentGroup.groupId).then(res => {
        that.list = res.models || []
      })
    },
    handleItem(item) {
      this.setStudentAppraisal({ aplCase: item })
      this.routeBack()
    }
  }
}

</script>
<style lang="scss" scoped>
@import "~scss/_mixin";
.case-list {
  .remark-txt {
    color: #999;
    font-size: rem(13);
  }
}

</style>
