<template>
  <div class="jc-user">
    <img class="user-logo" src="https://mlogin.vip.com/asserts/img/logo.ac5608f4.png" alt="">
    <div class="ui-form-item">
      <label for="input-mobile">手机号</label>
      <input id="input-mobile" name="mobile" type="tel" maxlength="11" placeholder="请输入手机号">
    </div>
    <div class="ui-form-item">
      <label for="input-password">密码</label>
      <input id="input-password" name="password" type="password" onpaste="return false;" placeholder="请输入密码">
    </div>
  </div>
</template>

<script>
export default {
  name: 'User',
  head: {
    link: []
  },
  data () {
    return {
      data: 'data1111'
    }
  },
  mounted () {
    if (this.mobileDownloadUrl) {
      this.makeCode('appDownloadEwm', this.mobileDownloadUrl)
    }
  },
  methods: {
    handleText () {}
  }
}
</script>

<style lang="scss" scoped>
.user-logo{
  width: 125px;
  height: 50px;
}
.ui-form-item{
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 15px;
  padding-right: 0;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  label{
    min-width: 50px;
    height: 52px;
    line-height: 52px;
    margin-right: 15px;
    font-size: 16px;
  }
  input{
    flex-grow: 1;
    height: 20px;
    font-size: 16px;
    border: none;
    color: #222;
    background-color: #fff;
    outline: none;
  }
}
// 共用样式全局
// chrome自动填充背景色
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active{
  box-shadow: 0 0 0 30px white inset;
}
</style>
