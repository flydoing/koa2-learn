<template>
  <div class="login-page">
    <div class="main"
         :style="h">
      <div class="login">
        <div class="login_logo">
          <img src="/static/favicon/gpx_favicon.ico">
        </div>
        <div class="login_panel panel active">
          <div class="login_input">
            <form autocomplete="off">
              <div class="account">
                <input name="account"
                       placeholder="帐号"
                       v-model.trim="account"
                       @keyup="onKeyup"
                       @keyup.13="onLogin()" />
              </div>
              <div class="password">
                <input name="password"
                       type="password"
                       placeholder="密码"
                       v-model.trim="password"
                       @keyup="onKeyup"
                       @keyup.13="onLogin()"
                       @focus="onFocus" />
              </div>
            </form>
          </div>
          <div class='validate-message'>{{errorMessage}}</div>
          <div class="login_butotns">
            <div class="login_button button"
                 @click="onLogin()">
              <i class="el-icon-loading"
                 v-if="loading"></i>登录</div>
            <div class="login_help">
              <div class="login_wj"
                   @click="onPassword">忘记密码？</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  import * as STORAGE from '@/constant/storage'
  import * as Storage from '@/utils/storage'
  import { mapActions } from 'vuex'
  import encryptUtil from '@/utils/encrypt'
  export default {
    computed: {
      h() {
        return { height: `${window.innerHeight}px` }
      }
    },
    created() {
      this.modifySigninStatus(false)
      Storage.local.remove(STORAGE.LOCAL_USER_INFO)
    },
    methods: {
      ...mapActions(['modifySigninStatus']),
      onLogin(url, accessToken, code) {
        const that = this
        if (Check.isNullString(this.account)) {
          this.errorMessage = '* 帐号不能为空'
          return null
        }
        if (Check.isNullString(this.password)) {
          this.errorMessage = '* 密码不能为空'
          return null
        }
        that.loading = true
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
            () => {
              that.loading = false
              that.$router.push('/vx')
            },
            auth => {
              that.loading = false
              that.errorMessage = `* ${auth.msg}`
            }
          )
      },
      onKeyup() {
        this.errorMessage = ''
      },
      onPassword() {
        this.$router.push('/password')
      },
      onFocus() {
        this.password = ''
        this.errorMessage = ''
      }
    },
    mounted() {
      Storage.session.clear()
    },
    data() {
      return {
        code: {},
        loading: false,
        account: '',
        password: '',
        errorMessage: ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';
  .login-page {
    .main {
      background: url(/static/login-bg.png) no-repeat bottom/120% 50% #7297f5;
      @include ct;
      .describe {
        @include fs($font-big);
        color: nth($font-color, 4);
        width: rem(300);
        line-height: 1.5;
        text-indent: 2em;
        text-shadow: 0 1px 1px rgba(32, 32, 32, 1);
        p:last-child {
          text-align: right;
        }
      }
      .login {
        width: rem(350);
        height: rem(344);
        background: #ffffff;
        border-radius: rem(4);
        box-shadow: 0 0 rem(20) rgba(0, 0, 0, 0.3);
        overflow: hidden;
        &-bar {
          width: 100%;
          display: table;
          line-height: rem(50);
          margin-bottom: rem(10);
        }
        &_logo {
          margin: rem(23) 0 rem(41);
          img {
            display: block;
            margin: 0 auto;
            // width: rem(194);
            // height: rem(75);
          }
        }
        .code_bar {
          display: table-cell;
          text-align: center;
          cursor: pointer;
          &.active {
            @include fc;
          }
          &:hover {
            background: nth($background, 2);
          }
        }
        .panel {
          display: none;
          position: relative;
          &.active {
            display: block;
          }
        }

        .login_input {
          width: rem(316);
          height: rem(103);
          margin: 0 auto;
          div {
            &.account,
            &.password {
              width: rem(314);
              margin-bottom: rem(15);
            }
          }
          input {
            @include fs($font-big);
            height: rem(44);
            padding-left: rem(10);
            margin: 0;
            width: rem(314);
            display: block;
            border: $border;
            outline: none;
            border-radius: rem(5);
          }
        }
        .validate-message {
          position: absolute;
          top: rem(105);
          left: rem(25);
          width: rem(250);
          margin: 0 auto;
          @include fs($font-small);
          color: nth($font-color, 5);
        }
        .login_butotns {
          margin: rem(21) auto 0;
          width: rem(316);
          line-height: rem(44);
          @include flex;
          justify-content: space-between;
          .login_button {
            margin: 0;
            height: rem(44);
            line-height: rem(44);
            width: rem(96);
          }
          .login_help {
            & > div {
              cursor: pointer;
              color: #9fbafb;
            }
          }
        }
        &_code_panel {
          img {
            width: rem(180);
            height: rem(166);
            margin: 0 auto;
          }
          div {
            height: rem(40);
            text-align: center;
            line-height: rem(40);
          }
        }
      }
    }
  }
</style>
