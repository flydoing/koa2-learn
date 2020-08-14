<template>
  <Page title="部门列表" :showTips="departments.length <= 0">
    <label slot="btn" @click="manager">部门管理</label>
    <item v-for="d in departments" :key="d.groupId" @click="department(d)">
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
        departments: []
      }
    },
    created() {
      const that = this
      const loading = that.$loading()
      GroupApi.getSchoolAllGroups(this.currentGroup.parentId).then(res => {
        loading.close()
        that.departments = res.groups
      })
    },
    methods: {
      department() {
        this.$message({ type: 'warning', message: '开发中' })
      },
      manager() {
        this.routePush({
          name: 'basiceManager'
        })
      }
    }
  }

</script>
