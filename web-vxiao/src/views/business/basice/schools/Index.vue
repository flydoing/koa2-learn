<template>
  <Page title="学校列表"
        :showTips="schoolGroups.length <= 0"
        :loading="loading">
    <item v-for="d in schoolGroups"
          :key="d.groupId"
          @click="handle(d)">
      <div slot="main">{{d.name}}</div>
      <div slot="remark">{{d.extension}}</div>
    </item>
  </Page>
</template>
<script>
  import GroupApi from '@/api/group'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        schoolGroups: [],
        loading: true
      }
    },
    created() {
      const that = this
      GroupApi.getSchoolAllGroups(this.currentGroup.parentId).then(res => {
        that.schoolGroups = res.schoolGroups
        this.loading = false
      })
    },
    methods: {
      handle() {
        this.$message({ type: 'warning', message: '开发中' })
      }
    }
  }
</script>
