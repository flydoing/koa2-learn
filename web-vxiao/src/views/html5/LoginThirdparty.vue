<template>
  <div class="login-page">

    <div class="main"
         :style="h"
         id="customizationLoginBg"
         v-if="thirdLogin">
      <p v-if="!isShowBind"
         class="third-login-p">{{thirdLoginTips}}</p>
      <div v-if="isShowBind"
           class="login">
        <el-row class="login-bar"
                type="flex"
                justify="center">
          <el-col class="code_bar account"
                  :span="9">登录</el-col>
        </el-row>
        <el-row type="flex"
                justify="center"
                class="login_panel panel">
          <el-col :span="18"
                  class="login_input">
            <form autocomplete="off">
              <div class="account">
                <input name="account"
                       placeholder="帐号"
                       v-model.trim="account" />
              </div>
              <div class="password">
                <input name="password"
                       type="password"
                       placeholder="密码"
                       v-model.trim="password" />
              </div>
            </form>
          </el-col>
          <el-col :span="18"
                  class='validate-message'>{{errorMessage}}</el-col>
          <el-col :span="18"
                  class="login_button button"
                  @click.native="handleBindLogin()">
            绑定</el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api/login'
import Check from '@/utils/check'
import { mapActions } from 'vuex'
import * as STORAGE from '@/constant/storage'
import * as Storage from '@/utils/storage'
import encryptUtil from '@/utils/encrypt'
export default {
  computed: {
    h() {
      return { height: `${this.innerHeight}px` }
    },
    line() {
      return this.lines[this.random]
    }
  },
  data() {
    return {
      thirdLogin: true,
      thirdLoginTips: '自动登录中...',
      account: '',
      password: '',
      AppMarket: {
        agentId: this.getUrlParam('agentId'),
        corpId: this.getUrlParam('corpId'),
        code: this.getUrlParam('code')
      },
      isShowBind: false,
      errorMessage: '',
      user: {
        thirdPartyId: '232667030836873833',
        schoolName: '广东马上信息科技'
      }
    }
  },
  created() {
    this.modifySigninStatus(false)
    Storage.local.remove(STORAGE.LOCAL_USER_INFO)
  },
  mounted() {
    // pc钉钉客户端调试代码
    // let script1 = document.createElement('script')
    // script1.src = '//cdn.jsdelivr.net/npm/eruda'
    // document.body.appendChild(script1)
    // script1.onload = function() {
    //   const eruda = window.eruda
    //   eruda.init()
    // }
    const that = this
    // that.ddPcLogin()
    if (this.getUrlParam('state')) {
      that.ddPcLogin()
    } else {
      that.ddPcLoginAppMarket()
      // if (this.AppMarket.code) {
      //   that.getDDUserTicket()
      // } else {
      //   that.ddPcLoginAppMarket()
      // }
    }
  },
  methods: {
    getUrlParam(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    },
    async ddPcLogin() {
      // let DDJsConfig = {
      //   corpId: 'ding60b3a5c7e7ae7c7e35c2f4657eb6378f',
      //   appId: 'ddkyohx50pct62ewd4kv92l8ur',
      //   type: '5',
      //   test: 'defalut-DDJsConfig'
      // }
      let DDJsConfig = {}
      try {
        // const s = this.getUrlParam('state') || 'ddkyohx50pct62ewd4kv92l8ur,5'
        const s = this.getUrlParam('state')
        const DDJsConfigRes = await Api.getDDJsConfig({
          state: s
        })
        if (DDJsConfigRes.code === '1') {
          DDJsConfig = DDJsConfigRes
        }
      } catch (e) {
        console.log('catch')
      }
      console.log(DDJsConfig)
      // 东莞外国语
      let script = document.createElement('script')
      const that = this
      // script.src = 'https://g.alicdn.com/dingding/open-develop/1.6.9/dingtalk.js' // 手机
      script.src = '//g.alicdn.com/dingding/dingtalk-jsapi/2.6.0/dingtalk.open.js'
      document.body.appendChild(script)
      script.onload = function() {
        window.dd.ready(function() {
          console.log('ready')
          console.log('DDJsConfig.corpId:====')
          console.log(DDJsConfig.corpId)
          window.dd.runtime.permission.requestAuthCode({
            corpId: DDJsConfig.corpId,
            onSuccess: function(info) {
              let code = info.code
              console.log('code:====')
              console.log(code)
              if (!code) {
                console.log('登录失败，缺失参数')
                return
              }
              that.ddLogin(DDJsConfig, code)
            },
            onFail: function(error) {
              console.log('登录失败:' + error.errorMessage)
              that.thirdLoginTips = '登录失败:' + error.errorMessage
              window.dd.device.notification.alert({
                message: '登录失败:' + error.errorMessage,
                buttonName: '确定'
              })
            }
          })
        })
      }
    },
    async ddLogin(DDJsConfig, code) {
      const DDRes = await Api.getDDUser({
        code: code,
        appId: DDJsConfig.appId,
        type: DDJsConfig.groupType
      })
      let data = DDRes
      console.log('DDRes====')
      console.log(DDRes)
      if (data.code === '1') {
        this.account = data.user.account
        this.onLogin('/base/aas/auth/token', data.accessToken)
      }
      console.log('over====')
    },
    ...mapActions(['modifySigninStatus']),
    onLogin(url, accessToken, code) {
      const that = this
      if (!accessToken && Check.isNullString(this.account)) {
        this.errorMessage = '* 帐号不能为空'
        return null
      }
      if (!accessToken && Check.isNullString(this.password)) {
        this.errorMessage = '* 密码不能为空'
        return null
      }
      that.loading = true
      let timeStamp = new Date().getTime()
      this.$store
        .dispatch('signin', {
          account: that.account,
          password: that.password,
          // account: encryptUtil.encrypt(that.account, timeStamp),
          // password: encryptUtil.encrypt(that.password, timeStamp),
          url: url,
          accessToken: accessToken,
          code: code,
          timeStamp: timeStamp
        })
        .then(
          () => {
            that.loading = false
            that.$router.push('/vx/')
          },
          auth => {
            that.loading = false
            that.errorMessage = `* ${auth.msg || '登录失败'}`
          }
        )
    },
    // 新版钉钉绑定登录
    ddPcLoginAppMarket() {
      console.log('ddPcLoginAppMarket')
      let script = document.createElement('script')
      const that = this
      script.src = '//g.alicdn.com/dingding/dingtalk-jsapi/2.6.0/dingtalk.open.js'
      document.body.appendChild(script)
      script.onload = function() {
        window.dd.ready(function() {
          console.log('ready')
          console.log(that.AppMarket.corpId)
          window.dd.runtime.permission.requestAuthCode({
            corpId: that.AppMarket.corpId,
            onSuccess: function(info) {
              let code = info.code
              console.log('code:====')
              console.log(code)
              that.getDDUserTicket(code)
            },
            onFail: function(error) {
              console.log('登录失败:' + error.errorMessage)
              that.thirdLoginTips = '登录失败:' + error.errorMessage
              window.dd.device.notification.alert({
                message: '登录失败:' + error.errorMessage,
                buttonName: '确定'
              })
            }
          })
        })
      }
    },
    async getDDUserTicket(code) {
      const DDUserTicket = await Api.getDDUserTicket({
        corpId: this.AppMarket.corpId,
        code: code || this.AppMarket.code,
        agentId: this.AppMarket.agentId
      })
      console.log('getDDUserTicket DDUserTicket====')
      console.log(DDUserTicket)
      // 有tokenID
      if (DDUserTicket.code === '1') {
        if (DDUserTicket.userData) {
          Storage.local.set(`${STORAGE.LOCAL_USER_INFO}`, JSON.stringify(DDUserTicket.userData))
          Storage.local.set(`${STORAGE.LOCAL_ACCOUNT}`, 11111111111)
          console.log(Storage.local.get(STORAGE.LOCAL_USER_INFO))
          this.$router.push('/vx/')
          // this.account = DDUserTicket.user.userId
          // this.onLogin('/base/aas/auth/token', DDUserTicket.accessToken)
        } else {
          this.$message({ type: 'warning', message: '首次登录，需要先绑定账号' })
          this.user = DDUserTicket.user
          this.isShowBind = true
        }
      }
    },
    // 无tokenID，显示登录
    handleBindLogin(url, accessToken, code) {
      const that = this
      if (Check.isNullString(this.account)) {
        this.errorMessage = '* 帐号不能为空'
        return null
      }
      if (Check.isNullString(this.password)) {
        this.errorMessage = '* 密码不能为空'
        return null
      }
      let timeStamp = new Date().getTime()
      this.$store
        .dispatch('signin', {
          account: encryptUtil.encrypt(that.account, timeStamp),
          password: encryptUtil.encrypt(that.password, timeStamp),
          url: url,
          accessToken: accessToken,
          code: code,
          timeStamp: timeStamp
        })
        .then(
          res => {
            // 绑定
            console.log(res)
            if (res && res.userData && res.userData.tokenId) {
              that.handleBind(res.userData)
            }
          },
          auth => {
            that.errorMessage = `* ${auth.msg || '登录失败'}`
          }
        )
    },
    handleBind(userData) {
      let dingTalkRequest = {
        userId: userData.userInfo.id,
        corpId: this.AppMarket.corpId,
        thirdPartyId: this.user.thirdPartyId,
        agentId: this.AppMarket.agentId,
        schoolName: this.user.schoolName
      }
      console.log(dingTalkRequest)
      Api.ticketUserisnfoBind(dingTalkRequest).then(res => {
        if (res && res.code === '1') {
          this.$message({
            type: 'success',
            message: '成功'
          })
          Storage.local.set(`${STORAGE.LOCAL_USER_INFO}`, JSON.stringify(res.userData))
          Storage.local.set(`${STORAGE.LOCAL_ACCOUNT}`, 11111111111)
          this.$router.push('/vx/')
        } else {
          this.$message({ type: 'error', message: '绑定失败，请重新绑定：' + res.msg })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';
  .third-login-p {
    font-size: 20px;
    color: #ffffff;
  }
  .login-page {
    .header {
      background: rgba(255, 255, 255, 0.9);
      height: rem(65);
      position: fixed;
      top: 0;
      z-index: 999;
      width: 100%;
      @include ct;
      &-box {
        width: 60%;
        cursor: pointer;
        @include ct;
      }
      &-logo,
      &-nav {
        flex-grow: 1;
        width: 50%;
      }
      &-logo {
        @include flex;
        @include ai(center);
        @include jc(flex-start);
        cursor: pointer;
        &-text {
          margin-left: nth($padding, 3);
          @include fs(16);
        }
      }
      &-nav {
        @include flex;
        @include ai(center);
        @include jc(flex-end);
        a {
          display: block;
          height: rem(65);
          padding: 0 rem(15);
          line-height: rem(65);
          @include fs(16);
          font-family: Arial, 'Hiragino Sans GB', md-hsgb, 'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif;
          &:hover {
            background: nth($background, 2);
          }
        }
      }
      a {
        color: #333 !important;
      }
    }
    .main {
      background: url(/static/banner.jpg) center center / cover no-repeat;
      @include ct;
      .describe {
        @include fs($font-big);
        color: nth($font-color, 4);
        width: rem(340);
        line-height: 1.5;
        text-indent: 2em;
        text-shadow: 0 1px 1px rgba(32, 32, 32, 1);
        p:last-child {
          text-align: right;
        }
      }
      .login {
        width: rem(320);
        height: rem(290);
        overflow: hidden;
        margin-left: rem(120);
        background: rgba(255, 255, 255, 0.9);
        @include borderRadius(nth($radius, 2));
        &-bar {
          font-size: rem(16);
          margin-bottom: rem(25);
        }
        .code_bar {
          cursor: pointer;
          text-align: center;
          position: relative;
          line-height: rem(50);
          border-bottom: rem(2);
          @include after {
            top: auto;
            bottom: rem(5);
            width: 100%;
            height: rem(0);
            background: nth($font-color, 2);
          }
          &.active {
            color: nth($font-color, 2);
            &:after {
              height: rem(2);
            }
          }
        }
        .login_panel {
          @include fd;
        }
        .login_input {
          width: rem(250);
          height: rem(90);
          border: $border;
          border-radius: rem(5);
          margin: 0 auto;
          div {
            &:before {
              pointer-events: none;
              content: '';
              position: absolute;
              height: rem(40);
              padding-left: rem(52);
              background: url(/static/username.png) no-repeat 18px center !important;
            }
            &.password:before {
              background: url(/static/password.png) no-repeat 18px center !important;
            }
            &.account input {
              border-bottom: $border;
              border-bottom-left-radius: rem(0);
              border-bottom-right-radius: rem(0);
            }
            &.password input {
              border-bottom: $border;
              border-top-left-radius: rem(0);
              border-top-right-radius: rem(0);
            }
          }
          input {
            @include fs($font-big);
            height: rem(45);
            padding-left: rem(50);
            width: 100%;
            display: block;
            margin: 0;
            border: 0;
            outline: none;
            border-radius: rem(5);
          }
        }
        .validate-message {
          position: absolute;
          top: rem(96);
          left: rem(25);
          margin: 0 auto;
          @include fs($font-small);
          color: nth($font-color, 5);
        }
        .login_button {
          width: rem(250);
          height: rem(40);
          line-height: rem(40);
          margin: rem(25) auto rem(20) !important;
        }
        .login_help {
          @include ct;
          @include jc(flex-end);
          width: rem(250);
          margin: 0 auto;
          margin-bottom: rem(20);
          & > div {
            width: 50%;
            cursor: pointer;
            &:last-child {
              text-align: right;
            }
          }
        }
        &_code_panel {
          img {
            width: rem(150);
            height: rem(150);
            margin: 0 auto rem(20);
            box-shadow: 0px 0px 30px 15px rgba(16, 185, 101, 0.2);
          }
          div {
            height: rem(40);
            text-align: center;
            font-size: rem(16);
            line-height: rem(40);
          }
        }
      }
    }
    .main-bg-vxiao {
      background: url(/static/banner.jpg) no-repeat center/cover;
    }
    .main-bg-tshf {
      background: url(/static/customizationLogin/tshf_banner.jpg) no-repeat center/cover;
    }
    .main-bg-zpnt {
      background: url(/static/customizationLogin/zpnt_banner.jpg) no-repeat center/cover;
    }
    footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: rem(50);
      background: rgba(255, 255, 255, 0.8);
      @include ct;
      & > div {
        text-align: center;
        padding: 0 rem(20);
      }
    }
  }
</style>
