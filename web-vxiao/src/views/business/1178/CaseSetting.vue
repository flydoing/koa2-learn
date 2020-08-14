<template>
  <page title="模板设置" @add="handleAdd" :hasAdd="true">
    <item v-for="(item, i) in list" :key="i" @click="handleCase(item)">
      <div slot="main" v-html="item.title"></div>
      <div slot="remark">{{item.questionCount}}项</div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
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
      appraisal: 'getTeacherAppraisal'
    })
  },
  methods: {
    ...mapActions(['setTeacherAppraisal']),
    fetchData() {
      const that = this
      Api.loadCaseList(that.currentGroup.groupId).then(res => {
        that.list = res.projectList || []
      })
    },
    handleAdd() {
      this.setTeacherAppraisal({ aplCase: null })
      this.routePush({ name: 'caseEdit1178' })
    },
    handleCase(item) {
      this.setTeacherAppraisal({ aplCase: item })
      this.routePush({ name: 'caseEdit1178' })
    }
  }
}

</script>
