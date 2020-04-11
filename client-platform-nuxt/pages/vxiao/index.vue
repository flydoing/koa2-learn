<template>
  <div class="jc-list">
    <div class="vx-verification-code">
      <img class="code-phone" src="" alt="">
      <p class="code-text">
        该操作需要安全认证
      </p>
      <p class="code-text">
        验证码已发送至135****9999
      </p>
      <div class="code-input">
        <input
          name="code"
          type="number"
          onpaste="return false;"
          placeholder="请输入验证码"
        >
        <a @click="handleCodeTimeCount" :class="{'btn-code-grey': codeCounting}" class="btn-code" href="javascript:;">{{ codeTimeInfo }}</a>
      </div>
      <div class="code-submit">
        确定
      </div>
    </div>
  </div>
</template>

<script>
// import Toast from '~/components/base/toast/toast'
// import { register } from '@/api/user'
// import { register } from '@/api/user'
export default {
  name: 'List',
  head: {
    link: [],
    script: [
      // { src: '//at.alicdn.com/t/font_1691530_i4id929hxk.js', async: true, defer: true }
      { src: '//at.alicdn.com/t/font_1691530_h4rsuyy1kx.js', async: true, defer: true }
    ]
  },
  // components: {
  //   Toast
  // },
  data () {
    return {
      visible: false,
      form: {
        accountMobile: '15011760731',
        code: ''
      },
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
    }
  },
  mounted () {
    // if (process.browser) {
    //   Vue.use(Toast)
    // }
    // this.$toastvant('提示内容wwwwww')
    // this.$toastvant.loading({
    //   message: '加载中...',
    //   forbidClick: true,
    //   loadingType: 'spinner'
    // })
  },
  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.vx-verification-code{
  position: relative;
  text-align: center;
  .code-phone{
    display: inline-block;
    width: 82px;
    height: 84px;
    margin: 5px 0;
    border: 1px solid green;
  }
  .code-text{
    margin-bottom: 5px;
    font-size: 14px;
    color: #333333;
  }
  .code-input{
    width: 340px;
    height: 32px;
    margin: 18px auto 18px;
    line-height: 32px;
    font-size: 12px;
    input{
      float: left;
      height: 32px;
      width: 218px;
      padding: 0 6px;
      border: 1px solid #CCCCCC;
      color: #222;
      background-color: #fff;
      outline: none;
    }
    .btn-code{
      float: right;
      width: 106px;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: #ffffff;
      background: #4AA468;
    }
    .btn-code-grey{
      background: #CCCCCC;
    }
  }
  .code-submit{
    width: 340px;
    height: 32px;
    margin: 0 auto;
    line-height: 32px;
    cursor: pointer;
    font-size: 12px;
    color: #ffffff;
    background: #4AA468;
  }
}
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
