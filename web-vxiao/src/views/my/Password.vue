<template>
  <Page title="修改密码"
        hasSubmit
        @submit="submit">
    <Item :hasClick="false">
      <input placeholder="请输入旧密码"
             type="password"
             maxlength="32"
             v-model="old" />
    </Item>
    <Item :hasClick="false">
      <input placeholder="请输入新密码"
             type="password"
             maxlength="32"
             v-model="pwd" />
    </Item>
    <Item :hasClick="false">
      <input placeholder="请再次输入新密码"
             type="password"
             maxlength="32"
             v-model="confirm" />
    </Item>
  </Page>
</template>
<script>
  import Api from '@/api/user'
  import encryptUtil from '@/utils/encrypt'
  export default {
    data() {
      return {
        old: '',
        pwd: '',
        confirm: ''
      }
    },
    methods: {
      submit() {
        if (this.pwd.length < 6 || this.old.length < 6 || this.confirm.length < 6) {
          this.$message({ type: 'warning', message: '密码长度为6~32' })
        } else if (this.pwd !== this.confirm) {
          this.$message({ type: 'warning', message: '密码不一致' })
        } else {
          let timeStamp = new Date().getTime()
          let headers = {
            ...this.$http.defaults.headers,
            common: {
              ...this.$http.defaults.headers.common,
              MFDate: timeStamp,
              encryVer: '1.0'
            }
          }
          Api.modifyPassword(
            {
              pwd: encryptUtil.encrypt(this.old, timeStamp),
              newPwd: encryptUtil.encrypt(this.pwd, timeStamp),
              mobile: encryptUtil.encrypt(this.USER.mobile, timeStamp)
            },
            headers
          ).then(res => {
            this.$message({ type: 'success', message: '操作成功' })
            this.routeBack(-2)

            this.offPage(false)
            this.$http.get('/base/user/logout')
            setTimeout(() => {
              let ctLogin = localStorage.getItem('customizationLogin')
              if (ctLogin === 'loginDzbp') {
                localStorage.removeItem('customizationLogin')
                this.routeReplace({ path: '/loginDzbp' })
              } else {
                this.routeReplace({ path: '/login' })
              }
            })
          })
        }
      }
    }
  }
</script>
