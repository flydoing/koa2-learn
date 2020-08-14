<template>
  <page :title="title">
    <item v-for="(item, i) in list" :key="i" @click="handleGrade(item)">
      <div slot="main" v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import GroupApi from '@/api/group'
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
    }),
    title() {
      let sub = this.appraisal.subject
      return sub ? `模板设置-${sub.name}` : '模板设置'
    }
  },
  methods: {
    ...mapActions(['setSubjectAppraisal']),
    fetchData() {
      const that = this
      GroupApi.getSchoolDefaultGrades(that.currentGroup.groupId).then(res => {
        that.list = res.groups || []
      })
    },
    handleGrade(item) {
      this.setSubjectAppraisal({ grade: item })
      this.routePush({ name: 'templateDetail1230' })
    }
  }
}

</script>
