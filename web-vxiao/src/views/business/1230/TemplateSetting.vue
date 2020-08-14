<template>
  <page title="模板设置">
    <item v-for="(item, i) in list" :key="i" @click="handleSubject(item)">
      <div slot="main" v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import CategoryApi from '@/api/category'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  components: {},
  data() {
    return {
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getSubjectAppraisal'
    })
  },
  methods: {
    ...mapActions(['setSubjectAppraisal']),
    fetchData() {
      const that = this
      CategoryApi.getCategorys({ type: '1', groupId: that.currentGroup.groupId }).then(res => {
        that.list = res.categorys || []
      })
    },
    handleSubject(item) {
      this.setSubjectAppraisal({ subject: item })
      this.routePush({ name: 'gradeList1230' })
    }
  }
}

</script>
