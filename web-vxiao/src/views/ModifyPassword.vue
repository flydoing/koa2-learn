<template>
  <div class="pwd-page">
    <div class="pwd-container">
      <header>
        <!-- <img src="/static/logo.png" /> -->
        <div>已有账号?<span class="text-color"
                @click="login">马上登录</span></div>
      </header>
      <div class="pwd-block">
        <div class="pwd-title">修改密码</div>
        <div class="pwd-main">
          <div class="block">
            <input type="password"
                   placeholder="输入新密码"
                   v-model="pwd"
                   @blur="pwdBlur" />
            <div class="error-message">{{pwdError}}</div>
          </div>
          <div class="block">
            <input type="password"
                   placeholder="确认新密码"
                   v-model="confirmPwd"
                   @blur="confirmPwdBlur" />
            <div class="error-message">{{confirmPwdError}}</div>
          </div>
          <div class="button"
               @click="next">提交</div>
        </div>
      </div>
    </div>
    <footer v-if="!isThirdparty">
      <div>服 务 热 线：020-38788257</div>
      <div>Q Q：2355283412</div>
      <div>邮 件：S@vxiao.cn</div>
    </footer>
  </div>
</template>
<script>
  import Api from '@/api/user'
  import * as Storage from '@/utils/storage'
  import encryptUtil from '@/utils/encrypt'
  export default {
    data() {
      return {
        pwdError: '',
        confirmPwdError: '',
        account: '',
        oldPwd: '',
        pwd: '',
        confirmPwd: ''
      }
    },
    computed: {
      isThirdparty() {
        return this.$route.path === '/passwordThirdparty'
      }
    },
    created() {
      let userInfo = Storage.local.get('USER_ORIGINAL_UERINFO') || {}
      this.account = userInfo.account
      this.oldPwd = userInfo.password
      Storage.local.remove('USER_ORIGINAL_UERINFO')
    },
    methods: {
      login() {
        this.routeBack()
      },
      next() {
        if (this.pwdBlur() && this.confirmPwdBlur()) {
          let timeStamp = new Date().getTime()
          let headers = {
            ...this.$http.defaults.headers,
            common: {
              ...this.$http.defaults.headers.common,
              MFDate: timeStamp,
              ClientId: `web${this.account}`,
              encryVer: '1.0'
            }
          }
          let loading = this.$loading({ target: '.pwd-block' })
          Api.modifyPassword(
            {
              pwd: encryptUtil.encrypt(this.oldPwd, timeStamp),
              newPwd: encryptUtil.encrypt(this.pwd, timeStamp),
              mobile: encryptUtil.encrypt(this.account, timeStamp)
            },
            headers
          )
            .then(res => {
              loading.close()
              this.$message({ type: 'success', message: '操作成功' })
              this.login()
            })
            .catch(res => {
              loading.close()
            })
        }
      },
      pwdBlur() {
        if (this.pwd === '') {
          this.pwdError = '密码至少6位，由字母或者数字构成'
          return false
        }
        this.pwdError = ''
        return true
      },
      confirmPwdBlur() {
        if (this.confirmPwd !== this.pwd) {
          this.confirmPwdError = '密码不一致'
          return false
        }
        this.confirmPwdError = ''
        return true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pwd {
    &-page {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #eee;
      @include ct;

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

      header {
        margin-bottom: rem(10);
        // @include flex;
        // @include ai(flex-end);
        // @include jc(space-between);
        @extend %clearfix;
        & > div {
          float: right;
        }
      }
    }

    &-container {
      width: 60%;
      height: 80%;
    }

    &-block {
      height: 80%;
      width: 100%;
      background: #fff;
      padding: 0 rem(30);
    }

    &-title {
      color: #525252;
      height: rem(80);
      text-align: left;
      font-size: rem(28);
      line-height: rem(80);
      border-bottom: rem(1) dashed #8d8d8d;
    }

    &-main {
      height: 87%;
      width: rem(338);
      margin: 0 auto;
      @include ct;
      @include fd;

      .pwd-steps {
        margin: rem(10) 0 rem(20);
      }

      .button {
        width: rem(338);
        height: rem(43);
        border-radius: 0;
        margin: rem(10) 0;
        line-height: rem(43);
      }

      .block {
        position: relative;
        margin: rem(10) 0;

        &.error {
          input {
            border-color: red;
          }
        }

        input {
          width: rem(338);
          height: rem(45);
          line-height: rem(45);
          padding-left: rem(15);
          border: rem(1) solid #ccc;
          background: #fff;
        }

        img {
          top: rem(8);
          right: rem(60+10+10);
          width: rem(80);
          height: rem(30);
          position: absolute;
        }

        .change {
          cursor: pointer;
          padding: 0 rem(10);
          top: rem(8);
          right: rem(10);
          height: rem(30);
          text-align: center;
          position: absolute;
          line-height: rem(30);
          @include bc;
          color: #fff;

          &.invalid {
            cursor: default;
            color: #444;
            background: nth($background, 1);
          }
        }

        .error-message {
          position: absolute;
          top: 0;
          left: rem(348);
          line-height: rem(45);
          color: red;
          width: max-content;
        }
      }
    }
  }
</style>
