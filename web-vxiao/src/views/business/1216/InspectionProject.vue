<template>
  <page title="巡检项目">
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
      inspection: 'getInspection'
    })
  },
  components: {
    ProjectList: resolve => require(['@/views/components/project/ProjectList'], resolve)
  },
  methods: {
    ...mapActions(['setInspection']),
    fetchData() {
      const that = this
      Api.loadProjectList(that.currentGroup.groupId).then(res => {
        that.list = res.items
      })
    },
    projectAdd(parent, list, parentIndex, dp, sort) {
      let index = list ? list.length + 1 : 1
      this.setInspection({
        parent: parent,
        title: parent ? `新建${sort}.${index}项目` : `新建${index}项目`,
        depth: dp,
        cache: null,
        project: null
      })
      this.routePush({ name: 'projectEdit1216' })
    },
    projectEdit(project, parent, index, parentIndex, dp, sort) {
      this.setInspection({
        parent: parent,
        title: parent ? `编辑${sort}.${index}项目` : `编辑${index}项目`,
        depth: dp,
        cache: project,
        project: null
      })
      this.routePush({ name: 'projectEdit1216' })
    }
  }
}

</script>
