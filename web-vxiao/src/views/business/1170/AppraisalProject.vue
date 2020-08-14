<template>
  <page title="评估项目">
    <ProjectList :list="list" :level="level" v-on:add="projectAdd" v-on:edit="projectEdit"></ProjectList>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  props: {},
  data() {
    return {
      list: [],
      level: 2
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getSuperviseAppraisal'
    })
  },
  components: {
    ProjectList: resolve => require(['@/views/components/project/ProjectList'], resolve)
  },
  methods: {
    ...mapActions(['setSuperviseAppraisal']),
    fetchData() {
      const that = this
      Api.loadProjectList(that.currentGroup.groupId).then(res => {
        that.list = res.items
      })
    },
    projectAdd(parent, list, parentIndex, dp, sort) {
      let index = list ? list.length + 1 : 1
      this.setSuperviseAppraisal({
        parent: parent,
        title: parent ? `新建${sort}.${index}项目` : `新建${index}项目`,
        depth: dp,
        project: null
      })
      this.routePush({ name: 'projectEdit1170' })
    },
    projectEdit(project, parent, index, parentIndex, dp, sort) {
      this.setSuperviseAppraisal({
        parent: parent,
        title: parent ? `编辑${sort}.${index}项目` : `编辑${index}项目`,
        depth: dp,
        project: project
      })
      this.routePush({ name: 'projectEdit1170' })
    }
  }
}

</script>
