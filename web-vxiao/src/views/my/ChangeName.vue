<template>
  <Page title="修改姓名"
        hasSubmit
        @submit="handleSubmit">
    <Item :hasClick="false">
      <input placeholder="必填"
             type="text"
             v-model="name" />
    </Item>
  </Page>
</template>
<script>
  import Api from '@/api/user'
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        name: ''
      }
    },
    created() {
      this.name = this.routeQuery('name') || ''
    },
    methods: {
      ...mapActions(['modifyLoginUser']),
      handleSubmit() {
        if (!this.name) {
          this.$message({ type: 'warning', message: `请输入姓名` })
          return false
        }
        // if (!/^1[34578]\d{9}$/.test(this.mobile)) {
        //   this.$message({ type: 'warning', message: `手机号码格式不正确` })
        //   return false
        // }
        // if (!this.code) {
        //   this.$message({ type: 'warning', message: `请输入验证码` })
        //   return false
        // }
        Api.modifyUser({
          id: this.USER.id,
          name: this.name,
          status: '1'
          // validateCode: this.code
        }).then(res => {
          this.modifyLoginUser(res.user)
          this.$message({ type: 'success', message: '修改成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .text-color.disabled {
    color: #999;
  }
</style>
