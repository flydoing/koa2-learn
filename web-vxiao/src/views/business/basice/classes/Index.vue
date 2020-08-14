<template>
  <Page title="班级列表" :showTips="classes.length <= 0" :loading="loading">
    <item v-for="d in classes" :key="d.groupId" @click="handle(d)">
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
        classes: [],
        loading: true
      }
    },
    created() {
      const that = this
      GroupApi.getSchoolAllGroups(this.currentGroup.parentId).then(res => {
        that.classes = res.classes
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
