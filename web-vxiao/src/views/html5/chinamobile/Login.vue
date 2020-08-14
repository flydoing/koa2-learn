<template>
  <div class="login-page">
    <div class="header">
      <div class="header-box">
        <a class="header-logo">
          <img class="header-logo-img"
               src="/static/favicon/chinamobile_logo_two.png">
          <!-- <div class="header-logo-text">中移智慧校园</div> -->
        </a>
        <div class="header-nav">
          <!-- <a href="https://itunes.apple.com/us/app/zhang-shang-xiao-yuan/id882630804">iOS</a>
          <a href="http://d.vxiao.cn">Android</a>
          <a href="http://d.vxiao.cn/pc/VXiao.exe">Windows</a>
          <a href="https://itunes.apple.com/us/app/v校/id1197926370?ls=1&mt=12">Mac</a> -->
          <!-- <a href="https://x.vxiao.cn/">Web登录</a> -->
        </div>
      </div>
    </div>
    <div class="main main-bg"
         :style="h">
      <div class='describe'>
        <!-- <p>{{line.content}}</p>
        <p>{{line.author}}</p> -->
      </div>
      <div class="login">
        <el-row class="login-bar"
                type="flex"
                justify="center">
          <el-col class="code_bar code"
                  :span="9"
                  :class="{'active':barType==='CODE'}"
                  @click.native="barClick('CODE')">扫码登录</el-col>
          <el-col class="code_bar account"
                  :span="9"
                  :class="{'active':barType==='ACCOUNT'}"
                  @click.native="barClick('ACCOUNT')">账户登录</el-col>
          <el-col class="code_bar account"
                  :span="9"
                  :class="{'active':barType==='SMS'}"
                  @click.native="barClick('SMS')">短信登录</el-col>
        </el-row>
        <!-- 扫码登录 -->
        <div class="login_code_panel panel"
             v-if="barType==='CODE'">
          <div v-show="isShowCode">
            <img v-lazy="{src:code.url}">
            <div>
              <span>{{code.remark}}</span>
              <span>{{code.describe}}</span>
            </div>
            <!-- <p v-if="code.url">code{{code.url}}</p>
            <img v-if="code.url"
                 v-lazy="{src:code.url}">
            <img v-if="code.url"
                 :src="code.url"> -->
          </div>
          <!-- <p v-if="code.url && isShowCode">code{{code.url}}</p>
          <img v-if="code.url && isShowCode"
               v-lazy="{src:code.url}">
          <img v-if="code.url && isShowCode"
               :src="code.url"> -->
        </div>
        <!-- 账号登录 -->
        <el-row type="flex"
                justify="center"
                class="login_panel panel"
                v-if="barType==='ACCOUNT'">
          <el-col :span="18"
                  class="login_input">
            <form autocomplete="off">
              <div class="account">
                <input name="account"
                       placeholder="帐号"
                       v-model.trim="account"
                       @keyup.exact="onKeyup"
                       @keyup.13="onLogin()" />
              </div>
              <div class="password">
                <input name="password"
                       type="password"
                       placeholder="密码"
                       v-model.trim="password"
                       @keyup.exact="onKeyup"
                       @keyup.13="onLogin()"
                       @focus="onFocus" />
              </div>
            </form>
          </el-col>
          <el-col :span="18"
                  class='validate-message'>{{errorMessage}}</el-col>
          <el-col class="login-agreement">
            <input type="checkbox"
                   v-model="isChecked"
                   name="type">已阅读并同意
            <span @click="handleShowAgreen">《用户服务协议》</span>
            <!-- <span>《隐私政策》</span> -->
          </el-col>
          <el-col :span="18"
                  class="login_button button"
                  @click.native="onLogin()">
            <i class="el-icon-loading"
               v-if="loading"></i>&nbsp;&nbsp;登录</el-col>
          <el-col :span="18"
                  class="login_help">
            <!-- <div class="login_jz">记住密码</div> -->
            <div class="login_wj"
                 @click="onPassword">忘记密码？</div>
          </el-col>
        </el-row>
        <!-- 短信登录 -->
        <el-row type="flex"
                justify="center"
                class="login_panel panel"
                v-if="barType==='SMS'">
          <el-col :span="18"
                  class="login_input">
            <form autocomplete="off">
              <div class="phone">
                <input name="phone"
                       placeholder="手机号码"
                       v-model.trim="phone"
                       @keyup.exact="onKeyup"
                       @keyup.13="onLoginSms()" />
              </div>
              <div class="vcode vcode-input">
                <input name="vcode"
                       placeholder="验证码"
                       v-model.trim="vcode"
                       @keyup.exact="onKeyup"
                       @keyup.13="onLoginSms()"
                       @focus="onFocus" />
                <div class="btn-vcode"
                     @click="handleCount()">{{codeTimeInfo}}</div>
              </div>
            </form>
          </el-col>
          <el-col :span="18"
                  class='validate-message'>{{errorMessage}}</el-col>
          <el-col class="login-agreement">
            <input type="checkbox"
                   v-model="isChecked"
                   name="type">已阅读并同意
            <span>《用户服务协议》</span>
          </el-col>
          <el-col :span="18"
                  v-if="barType==='ACCOUNT'"
                  class="login_button button"
                  @click.native="onLogin()">
            <i class="el-icon-loading"
               v-if="loading"></i>&nbsp;&nbsp;登录</el-col>
          <el-col :span="18"
                  v-if="barType==='SMS'"
                  class="login_button button"
                  @click.native="onLoginSms()">
            <i class="el-icon-loading"
               v-if="loading"></i>&nbsp;&nbsp;登录</el-col>
          <!-- <el-col :span="18"
                  class="login_help">
            <div class="login_wj"
                 @click="onPassword">忘记密码？</div>
          </el-col> -->
        </el-row>
      </div>
    </div>
    <footer>
      <!-- <div>服 务 热 线：020-38788257</div>
      <div>Q Q：2355283412</div>
      <div>邮 件：S@vxiao.cn</div> -->
      <!-- <div>copyright@zhongguoyidong2019</div> -->
    </footer>

    <Overlay :show="true"
             v-if="isShowAgreenMent"
             @close="handle">
      <div class="iframe-agreen">
        <div class="iframe-agreen-header"></div>
        <iframe id="child"
                width="100%"
                height="100%"
                src="https://www.vxiao.cn/m/agreement.html"
                scrolling="auto"
                frameborder="0"></iframe>
      </div>
    </Overlay>
    <!-- <Overlay :show.sync="true"
             :width="400"
             :height="150"
             @close="handle">
      <div class="attend-select-time">
        hhhhhhh
      </div>
    </Overlay> -->
  </div>
</template>
<script>
  import Api from '@/api/login'
  import Check from '@/utils/check'
  import * as STORAGE from '@/constant/storage'
  import * as Storage from '@/utils/storage'
  import { mapActions } from 'vuex'
  import encryptUtil from '@/utils/encrypt'
  import Overlay from './Overlay.vue'
  export default {
    computed: {
      h() {
        return { height: `${this.innerHeight}px` }
      }
    },
    components: {
      Overlay
      // Overlay: resolve => require(['@/modules/chinamobile/components/Overlay'], resolve)
      // Overlay: resolve => require(['./Overlay'], resolve)
      // SelectTime: resolve => require(['@/views/business/1237/SelectTime'], resolve)
    },
    created() {
      this.modifySigninStatus(false)
      Storage.local.remove(STORAGE.LOCAL_USER_INFO)
    },
    methods: {
      ...mapActions(['modifySigninStatus']),
      handleShowAgreen() {
        this.isShowAgreenMent = true
      },
      handle() {
        console.log('handle....')
        this.isShowAgreenMent = false
        // this.$emit('update:show', false)
      },
      onLogin(url, accessToken, code) {
        const that = this
        if (!this.isChecked) {
          this.errorMessage = '* 登录需勾选同意用户服务协议'
          return null
        }
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
            account: encryptUtil.encrypt(that.account, timeStamp),
            password: encryptUtil.encrypt(that.password, timeStamp),
            url: url,
            accessToken: accessToken,
            code: code,
            timeStamp: timeStamp
          })
          .then(
            auth => {
              that.loading = false
              clearInterval(this.timer) // 登陆成功后清除定时器
              if (auth.userData.accountStatus === 'u') {
                Storage.local.set(
                  `USER_ORIGINAL_UERINFO`,
                  JSON.stringify({
                    account: that.account,
                    password: that.password
                  })
                )
                that.$router.push('/modifyPassword')
              } else {
                Storage.local.remove('customizationLogin')
                that.$router.push('/vx/')
              }
            },
            auth => {
              that.loading = false
              that.errorMessage = `* ${auth.msg || '登录失败'}`
            }
          )
      },
      onPassword() {
        this.$router.push('/passwordThirdparty')
        // this.$router.push('/password')
      },
      onKeyup() {
        this.errorMessage = ''
      },
      onFocus() {
        this.password = ''
        this.errorMessage = ''
      },
      barClick(type) {
        this.barType = type
        if (type === 'CODE') {
          this.loadCode()
        }
      },
      loadCode(userId) {
        if (this.barType !== 'CODE') {
          return null
        }
        let url = '/base/aas/qrcode?platform=zy'
        if (this.code.url && this.code.url !== '') {
          url = `${url}&id=${this.code.id}`
        }
        if (userId) {
          url = `${url}&userId=${userId}`
        }
        Api.loadCode(url).then(res => {
          if (res.user && Check.isNull(res.accessToken)) {
            this.loadCode(res.user.id)
            this.code.url = `/commons/file/${res.user.avatar}`
            this.code.remark = '扫码成功'
            this.code.describe = '请在手机上确认登录'
          } else if (!Check.isNull(res.accessToken)) {
            this.onLogin('/base/aas/auth/token', res.accessToken, this.code.id)
          } else if (res.qrcode) {
            this.code.url = `/commons/file/${res.qrcode}`
            this.code.id = res.qrcode
            // this.code.describe = '使用V校App扫码登录'
            this.code.describe = '使用App扫码登录'
            this.loadCode()
          } else {
            this.loadCode()
          }
          this.isShowCode = true
        })
      },
      // 短信登录
      handleCount() {
        this.getCode()
      },
      checkPhone() {
        let _this = this
        if (!/^1\d{10}$/.test(_this.phone)) {
          this.errorMessage = '* 请核对11位手机号'
          return false
        } else {
          return true
        }
      },
      checkCode() {
        let _this = this
        if (!_this.checkPhone()) {
          return false
        }
        if (!/\d{4}/.test(_this.vcode)) {
          this.errorMessage = '* 请核对4位验证码'
          return false
        }
        return true
      },
      onCodeTimeCount() {
        var _this = this
        if (!_this.checkPhone()) {
          return false
        }
        if (_this.codeCounting) {
          return false
        }
        let TimeObject = setInterval(function() {
          if (_this.codeTime > 0) {
            _this.codeTimeInfo = _this.codeTime + '秒重新获取'
            _this.codeCounting = true
          }
          _this.codeTime--
          if (_this.codeTime < 0) {
            clearInterval(TimeObject)
            _this.codeTimeInfo = '获取验证码'
            _this.codeCounting = false
            _this.codeTime = 60
            // _this.codeTime = 5
          }
        }, 1000)
      },
      async getCode() {
        // this.onCodeTimeCount()
        let that = this
        if (!this.checkPhone() || this.codeCounting) {
          return false
        }
        Api.checkLoginMobile(this.phone)
          .then(data => {
            if (data && data.code === '1') {
              this.onCodeTimeCount()
            } else {
              that.errorMessage = `* ${data.msg}`
            }
          })
          .catch(data => {
            that.errorMessage = `* ${data.msg}`
          })
      },
      onLoginSms() {
        if (Check.isNullString(this.phone)) {
          this.errorMessage = '* 手机号不能为空'
          return null
        }
        if (Check.isNullString(this.vcode)) {
          this.errorMessage = '* 验证码不能为空'
          return null
        }
        let that = this
        that.loading = false
        clearInterval(this.timer) // 登陆成功后清除定时器
        Api.loginMobileCode(this.phone, this.vcode)
          .then(data => {
            if (data && data.code === '1') {
              Storage.local.remove('customizationLogin')
              Storage.local.set(`${STORAGE.LOCAL_USER_INFO}`, JSON.stringify(data.userData))
              Storage.local.set(`${STORAGE.LOCAL_ACCOUNT}`, 11111111111)
              that.$router.push('/vx/')
            } else {
              that.loading = false
              that.errorMessage = `* ${data.msg || '登录失败'}`
            }
          })
          .catch(data => {
            that.errorMessage = `* ${data.msg}`
          })
      }
    },
    mounted() {
      Storage.session.clear()
    },
    data() {
      return {
        timer: null, // 登陆页定时器
        code: {},
        loading: false,
        account: '',
        password: '',
        errorMessage: '',
        random: 0,
        barType: 'ACCOUNT',
        // 短信登录
        phone: '',
        vcode: '',
        codeTimeInfo: '获取验证码',
        codeTime: 60,
        codeCounting: false,
        isShowCode: false,
        isShowAgreenMent: false,
        isChecked: true
      }
    }
  }
</script>
<style lang="scss" scoped>
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
        // width: 60%;
        width: 100%;
        padding-left: 8%;
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
      // background: url(/static/banner.jpg) no-repeat center/cover;
      background-color: rgba(1, 1, 1, 0.5);
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
        box-sizing: border-box;
        width: rem(400);
        height: rem(425);
        padding: 40px;
        overflow: hidden;
        margin-left: 30%;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        // opacity: 0.7;
        @include borderRadius(nth($radius, 2));
        &-bar {
          font-size: rem(16);
          margin-bottom: rem(30);
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
            left: 50%;
            margin-left: rem(-33);
            width: rem(65);
            height: rem(0);
            @include bc;
          }
          &.active {
            @include fc;
            &:after {
              height: rem(2);
            }
          }
        }
        .login_panel {
          @include fd;
        }
        .login_input {
          width: rem(320);
          height: rem(90);
          border: $border;
          border-radius: rem(5) rem(5) 0 0;
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
            &.phone:before {
              background: url(/static/phone.png) no-repeat 18px center !important;
            }
            &.vcode:before {
              background: url(/static/vcode.png) no-repeat 18px center !important;
            }
            &.account input {
              border-bottom: $border;
              border-bottom-left-radius: rem(0);
              border-bottom-right-radius: rem(0);
            }
            &.password input {
              border-bottom: $border;
              border-radius: 0 0 rem(5) rem(5);
            }
            &.phone input {
              border-bottom: $border;
              border-bottom-left-radius: rem(0);
              border-bottom-right-radius: rem(0);
            }
            &.vcode input {
              border-bottom: $border;
              border-radius: 0 0 0 rem(5);
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
            border-radius: rem(5) rem(5) 0 0;
          }
          .vcode-input {
            border-radius: 0 0 rem(5) rem(5);
            background: #ffffff;
          }
          .vcode-input input {
            width: 60%;
            display: inline-block;
          }
          .btn-vcode {
            @include fc;
            float: right;
            width: 39%;
            height: 45px;
            line-height: 45px;
            text-align: right;
            background: #ffffff;
            padding-right: 6px;
            border-bottom: #ededed solid 1px;
            border-radius: 0 0 rem(5) 0;
            cursor: pointer;
          }
          .btn-vcode:before {
            display: none;
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
        .login-agreement {
          margin-top: 20px;
          margin-bottom: 35px;
          width: 100%;
          color: rgba(108, 117, 125, 1);
          input {
            margin-right: 4px;
          }
          span {
            cursor: pointer;
            font-size: 14px;
            @include fc;
          }
        }
        .login_button {
          width: 100%;
          height: rem(50);
          line-height: rem(50);
          font-size: rem(18);
          // margin: rem(70) auto rem(20) !important;
          margin: rem(0) auto rem(20) !important;
        }
        .login_help {
          @include ct;
          @include jc(flex-end);
          width: 100%;
          margin: 0;
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
            // box-shadow: 0px 0px 30px 15px rgba(16, 185, 101, 0.2);
            box-shadow: 0px 0px 30px 15px rgba(226, 240, 255, 1);
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
    .main-bg {
      // background: url(/static/favicon/tianhe_banner.jpg) no-repeat center/cover;
      background: url(/static/favicon/chinamobile_banner.png) no-repeat center/cover;
    }
    .header-logo-img {
      display: inline-block;
      width: 258px; // 198 329px
      height: 35px; // 27 44px
    }
    footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: rem(65);
      background: rgba(255, 255, 255, 0.9);
      @include ct;
      & > div {
        text-align: center;
        padding: 0 rem(20);
      }
    }
  }
  .iframe-agreen {
    width: 41vw;
    height: 70vh;
    background: #ffffff;
    border-radius: 3px;
  }
</style>
