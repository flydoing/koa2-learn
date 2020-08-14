<template>
  <Page title="绑定北电项目"
        hasSubmit
        @submit="submit">
    <Item :hasClick="false">
      <div>项目编号</div>
      <input slot="remark"
             v-model.trim="projectCode"
             placeholder="请输入项目编号" />
    </Item>
  </Page>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        projectCode: '' // 项目编号
      }
    },
    created() {
      if (this.routeQuery('projectCode')) {
        this.projectCode = this.routeQuery('projectCode')
      }
    },
    methods: {
      submit() {
        if (this.projectCode === '') {
          this.$message.warning('项目编号不能为空')
          return
        }
        let projectCode = this.projectCode
        let schoolId = this.schoolId
        Api.bindingProject(schoolId, projectCode).then(res => {
          if (res.code === '1') {
            this.$message.success('绑定成功')
            this.$router.go(-1)
          }
        })
      }
    }
  }
</script>
