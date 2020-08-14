<template>
  <page :title="title" @add="handleAdd" :hasAdd="true">
    <div class="template-detail">
      <div v-for="(item, i) in list" :key="i">
        <div class="category-title text">{{item.name}}<span class="right td-edit" @click="handleItem(item)">编辑</span></div>
        <item v-for="(child, j) in item.childs" :key="j" :hasClick="false">
          <div slot="main" v-html="child.name"></div>
        </item>
      </div>
    </div>
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
      appraisal: 'getSubjectAppraisal'
    }),
    title() {
      let sub = this.appraisal.subject
      let grade = this.appraisal.grade
      return sub && grade ? `模板设置-${grade.name}-${sub.name} ` : '模板设置'
    }
  },
  methods: {
    ...mapActions(['setSubjectAppraisal']),
    fetchData() {
      const that = this
      let subjectId = that.appraisal.subject.id
      let type = that.appraisal.grade.gradeType
      Api.loadTemplateDetail(that.currentGroup.groupId, subjectId, type).then(res => {
        that.list = res.categorys || []
      })
    },
    handleAdd() {
      this.setSubjectAppraisal({ category: null })
      this.routePush({ name: 'categoryEdit1230' })
    },
    handleItem(item) {
      this.setSubjectAppraisal({ category: item })
      this.routePush({ name: 'categoryEdit1230' })
    }
  }
}

</script>
<style lang="scss" scoped>
@import "~scss/_mixin";
.template-detail {
  .td-edit {
    cursor: pointer;
  }
}

</style>
