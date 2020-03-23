<template>
  <div class="jc-user">
    <div class="user-banner">
      <svg class="icon user-logo" aria-hidden="true"><use xlink:href="#icon-Ggooglelogo" /></svg>
    </div>
    <div v-if="pageType === 'mine'" class="page-logon">
      已登录
    </div>
    <div v-else class="page-logout">
      <div class="ui-form-item">
        <label for="input-mobile">手机号</label>
        <input
          id="input-mobile"
          ref="refMobile"
          v-model="form.accountMobile"
          @focus="handleShowClose('accountMobile')"
          @blur="handleShowClose('')"
          name="mobile"
          type="tel"
          maxlength="11"
          placeholder="请输入手机号"
        >
        <a v-show="showClose === 'accountMobile'" @click="handleClear('accountMobile')" href="javascript:;" class="form-item-close">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-close" /></svg>
        </a>
      </div>
      <!-- 注册：验证码 -->
      <div v-show="pageType === 'register'" class="ui-form-item">
        <label for="input-code">验证码</label>
        <input
          id="input-code"
          v-model="form.code"
          @focus="handleShowClose('code')"
          @blur="handleShowClose('')"
          @input="handleTypeNumberMax"
          name="code"
          type="number"
          onpaste="return false;"
          placeholder="请输入验证码"
        >
        <a v-show="showClose === 'code'" @click="handleClear('code')" href="javascript:;" class="form-item-close form-item-close-right121">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-close" /></svg>
        </a>
        <a @click="handleCodeTimeCount" :class="{'btn-code-grey': codeCounting}" class="form-item-btn" href="javascript:;">{{ codeTimeInfo }}</a>
      </div>
      <div class="ui-form-item">
        <label for="input-password">密码</label>
        <input
          id="input-password"
          v-model.trim="form.password"
          @focus="handleShowClose('password')"
          @blur="handleShowClose('')"
          :type="eyeType"
          name="password"
          maxlength="6"
          placeholder="请输入密码"
        >
        <a v-show="showClose === 'password'" @click="handleClear('password')" href="javascript:;" class="form-item-close form-item-close-right40">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-close" /></svg>
        </a>
        <a @click="handleEye" href="javascript:;" class="form-item-close">
          <svg class="icon icon-yanjing" aria-hidden="true"><use xlink:href="#icon-yanjing" /></svg>
        </a>
      </div>
      <div class="user-change-type">
        <a @click="handleSubmit" :class="{'ui-form-button-grey': !isLoginActive && !isRegisterActive}" href="javascript:;" class="ui-form-button">
          {{ textSubmit }}
        </a>
        <div class="ui-form-border">
          <span class="ui-form-border-text">或</span>
        </div>
        <a @click="handlePageType" href="javascript:;" class="ui-form-button ui-form-button-white">
          {{ textChangeType }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'
export default {
  name: 'User',
  head: {
    link: [],
    script: [
      { src: '//at.alicdn.com/t/font_1691530_h4rsuyy1kx.js', async: true, defer: true }
    ]
  },
  // components: {
  //   Toast
  // },
  data () {
    return {
      toast: {
        visible: false,
        message: ''
      },
      form: {
        accountMobile: '',
        password: '',
        code: ''
      },
      pageType: 'login', // login,register,mine
      showClose: '',
      eyeType: 'password',
      codeCounting: false,
      codeTimeInfo: '获取验证码',
      codeTime: 60
    }
  },
  computed: {
    textSubmit () {
      return this.pageType === 'login' ? '登 录' : '注 册'
    },
    textChangeType () {
      return this.pageType === 'login' ? '手机注册' : '密码登录'
    },
    isLoginActive () {
      return this.pageType === 'login' && this.form.accountMobile && this.form.password
    },
    isRegisterActive () {
      return this.pageType === 'register' && this.form.accountMobile && this.form.password && this.form.code
    }
  },
  watch: {
    'toast.visible' (val, old) {
      if (val) {
        const that = this
        setTimeout(() => {
          that.toast.visible = false
        }, 1800)
      }
    }
  },
  methods: {
    handleToast () {
      this.$toast.show('Logging in...')
      this.$toast.success('Successfully authenticated')
      this.$toast.error('Error while authenticating')
      this.$toast.show('hello there, i am a toast !!', { icon: 'check' })
      this.$toast.show('hello there, i am a toast !!', { icon: 'https://www.baidu.com/img/baidu_resultlogo@2.png' })
    },
    handlePageType () {
      this.pageType = this.pageType === 'login' ? 'register' : 'login'
      this.form = {
        mobile: '',
        password: '',
        code: ''
      }
    },
    handleTypeNumberMax () {
      if (this.form.code.length > 4) {
        this.form.code = this.form.code.slice(0, 4)
      }
    },
    handleEye () {
      this.eyeType = this.eyeType === 'password' ? 'text' : 'password'
    },
    handleClear (type) {
      this.form[type] = ''
    },
    handleShowClose (type) {
      const that = this
      setTimeout(() => {
        that.showClose = type
      }, 50)
    },
    handleCodeTimeCount () {
      const that = this
      if (!this.form.accountMobile) {
        return false
      }
      if (that.codeCounting) {
        return false
      }
      if (that.codeTime > 0) {
        that.codeTimeInfo = that.codeTime + 's'
        that.codeCounting = true
      }
      const TimeObject = setInterval(() => {
        if (that.codeTime > 0) {
          that.codeTimeInfo = that.codeTime + 's'
          that.codeCounting = true
        }
        that.codeTime--
        if (that.codeTime < 0) {
          clearInterval(TimeObject)
          that.codeTimeInfo = '获取验证码'
          that.codeCounting = false
          that.codeTime = 60
          // that.codeTime = 5
        }
      }, 1000)
    },
    handleSubmit () {
      if (this.pageType === 'login') {
        this.submitLogin()
      } else {
        this.submitRegister()
      }
    },
    submitLogin () {
      if (!this.isMobile(this.form.accountMobile)) {
        this.toast = {
          visible: true,
          message: '请输入正确的手机号'
        }
        return
      }
      if (!this.isPassword(this.form.password)) {
        this.toast = {
          visible: true,
          message: '请输入正确格式的密码：六位数字'
        }
        return
      }
      login(this.form).then((res) => {
        if (res.code !== 200) {
          this.$toastvant.fail(res.msg)
        } else {
          this.$toastvant.success(res.msg)
          this.pageType = 'mine'
        }
      }).catch((error) => {
        this.$toastvant.fail(error)
      })
    },
    submitRegister () {
      if (!this.isMobile(this.form.accountMobile)) {
        this.toast = {
          visible: true,
          message: '请输入正确的手机号'
        }
        return
      }
      if (!this.isCode(this.form.code)) {
        this.toast = {
          visible: true,
          message: '请输入正确格式的验证码: 四位数字'
        }
        return
      }
      if (!this.isPassword(this.form.password)) {
        this.toast = {
          visible: true,
          message: '请输入正确格式的密码：六位数字'
        }
        return
      }
      this.$toastvant.loading({
        message: '注册中...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      register(this.form).then((res) => {
        if (res.code !== 200) {
          this.$toastvant.fail(res.msg)
        } else {
          this.$toastvant.success(res.msg)
          this.pageType = 'login'
        }
      }).catch((error) => {
        this.$toastvant.fail(error)
      })
    },
    isMobile (mobile) {
      if (mobile) {
        if (/^1[3|4|5|7|8]\d{9}$/.test(mobile)) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 6位数字
    isPassword (password) {
      if (/^\d{6}$/.test(password)) {
        return true
      } else {
        return false
      }
    },
    isCode (code) {
      if (/^\d{4}$/.test(code)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-user{
  text-align: center;
}
.user-banner{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 170px;
  background-color: #fbf7fa;
  .user-logo{
    width: 125px;
    height: 50px;
    color: #de3d96;
  }
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
    text-align: left;
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
  .form-item-close{
    position: absolute;
    right: 0;
    width: 40px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .form-item-close-right40{
    right: 40px;
  }
  .form-item-close-right121{
    right: 111px;
  }
  .form-item-btn{
    position: absolute;
    right: 0;
    width: 110px;
    height: 52px;
    line-height: 52px;
    text-align: center;
    font-size: 16px;
    color: #4a90e2;
    border-left: 1px solid #dbdbdb;
  }
  .btn-code-grey{
    color: #353434;
  }
}
.ui-form-button{
  display: block;
  width: 80%;
  height: 44px;
  line-height: 44px;
  text-align: center;
  margin: 28px auto 28px;
  padding: 0 14px;
  font-size: 16px;
  color: #fff;
  background-color: #de3d96;
  border-radius: 22px;
}
.ui-form-button-white{
  width: 40%;
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  color: #de3d96;
  background-color: #ffffff;
  border: 1px solid #de3d96;
}
.ui-form-button-grey{
  color: #ffffff;
  background-color: #caccd2;
}
.ui-form-border{
  position: relative;
  width: 100%;
  height: 1px;
  background-color: #dbdbdb;
  .ui-form-border-text{
    position: absolute;
    left: 50%;
    top: -9px;
    margin-left: -16px;
    width: 32px;
    height: 18px;
    font-size: 12px;
    color: #dbdbdb;
    background-color: #ffffff;
  }
}
// 淘宝字体
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.icon-yanjing{
  width: 1.5em;
  height: 1.5em;
}
// 共用样式全局
// chrome自动填充背景色
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active{
  box-shadow: 0 0 0 30px white inset;
}
input::-webkit-input-placeholder{
  color:#ccc
}
a{
  text-decoration: none;
  color: rgb(0,0,0);
}
// 去掉点击阴影
a, button, div, em, i, input, li, p, section, span, ul{
  -webkit-tap-highlight-color: rgba(255,0,0,0);
}
</style>
