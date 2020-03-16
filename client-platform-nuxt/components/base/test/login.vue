<template>
  <section class="login">
    <Header></Header>
    <div class="main">
      <div class="form-container">
        <div class="ui-form">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="登录" name="first">
              <div class="form-main">
                <div class="form-item">
                  <input class="item-input item-input-large" type="text" name="username"
                         maxlength="11"
                         autocomplete="off"
                         v-model="login.username"
                         placeholder="请输入登录手机号">
                  <!--<span class="item-error">{{errorTips.username}}</span>-->
                </div>
                <div class="form-item" v-if="login.loginType === 1">
                  <input class="item-input item-input-large" :type="passwordType" name="password"
                         maxlength="16"
                         autocomplete="new-password"
                         v-model="login.password"
                         @keyup.enter="handleLogin"
                         placeholder="请输入密码">
                  <svg class="eye" @click="showPassword"
                       style="width: 20px;height: 20px;vertical-align: middle;fill: currentColor;overflow: hidden;"
                       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                       p-id="1549">
                    <path
                        d="M264.039093 676.720575c68.369134 40.488133 153.807015 71.28351 247.238964 71.28351l0 0 0 0c109.941971 0 209.067596-42.206264 280.83513-93.527117 71.208808-50.760081 115.65509-108.936061 115.65509-142.001131l0 0 0 0c0-33.084513-44.447305-91.25026-115.65509-142.002155-71.768557-51.330062-170.894182-93.52814-280.83513-93.52814l0 0c-93.431949 0-178.86983 30.797423-247.238964 71.285556C173.464215 402.980028 115.347586 474.264561 115.347586 512.475837l0 0C115.347586 550.676881 173.464215 621.961414 264.039093 676.720575L264.039093 676.720575zM233.280556 310.589804c76.344782-48.471968 173.174108-85.544305 277.997502-85.544305l0 0c105.384166 0 201.655789 37.072337 277.998525 85.544305 103.684454 66.150606 169.756265 153.97279 169.756265 201.886033 0 47.8938-66.070788 135.726218-169.756265 201.874777-76.342736 48.483224-172.614359 85.535095-277.998525 85.535095l0 0c-104.823394 0-201.652719-37.051871-277.997502-85.535095-103.105263-66.149583-169.756265-153.982-169.756265-201.874777C63.524291 464.562595 130.175293 376.739387 233.280556 310.589804L233.280556 310.589804zM401.897881 622.541629c27.918863 27.938306 66.651003 45.046962 109.380176 45.046962l0 0 0 0c42.729174 0 81.461313-17.108656 109.941971-45.046962 27.91784-28.51852 45.00603-67.306942 45.00603-110.065791l0 0c0-42.778292-17.08819-81.557504-45.00603-109.49581-28.479635-28.519544-67.212798-45.62513-109.941971-45.62513s-81.46029 17.10661-109.380176 45.62513c-28.479635 27.938306-45.566802 66.717518-45.566802 109.49581C356.33108 555.233664 373.41927 594.022085 401.897881 622.541629L401.897881 622.541629zM365.443621 365.907691c37.014009-37.072337 88.87619-60.45386 145.834436-60.45386l0 0c56.95927 0 108.800985 23.382547 146.394185 61.023842 37.033451 37.071314 60.395532 88.962148 60.395532 145.998165 0 57.026808-23.361057 108.925828-60.395532 146.557914-37.592177 37.071314-89.433892 60.45386-146.394185 60.45386-56.958246 0-108.819404-23.38357-145.834436-60.45386-37.592177-37.631062-60.95528-89.531106-60.95528-146.557914C304.488341 455.43982 327.851445 403.548986 365.443621 365.907691L365.443621 365.907691zM464.552873 465.711767c11.970636-11.980869 28.499078-19.394722 46.725184-19.394722l0 0c18.22713 0 34.754548 7.413853 46.706765 19.394722l0 0c11.971659 11.970636 19.36607 28.508287 19.36607 46.76407 0 18.23634-7.394411 34.783201-19.36607 46.753837-11.952216 11.970636-28.479635 19.384489-46.706765 19.384489l0 0c-18.22713 0-34.754548-7.413853-46.725184-19.384489l0 0c-11.951193-11.970636-19.346627-28.517497-19.346627-46.753837C445.206246 494.220055 452.60168 477.68138 464.552873 465.711767L464.552873 465.711767z"
                        p-id="1550"></path>
                  </svg>
                  <!--<span class="item-error">{{errorTips.password}}</span>-->
                </div>
                <div class="form-item" v-if="login.loginType === 2">
                  <input class="item-input item-input-large" type="text" name="password" maxlength="6"
                         autocomplete="off"
                         v-model="login.password"
                         @keyup.enter="handleLogin"
                         placeholder="输入手机验证码">
                  <a class="item-code" v-if="sendCodeDisabled" href="javascript:;">{{sendCodetime+'秒后获取'}}</a>
                  <a class="item-code" v-if="!sendCodeDisabled" @click="handleSendSms"
                     href="javascript:;">获取验证码</a>
                  <!--<span class="item-error">{{errorTips.password}}</span>-->
                </div>
              </div>
              <div class="form-switch">
                <a v-if="login.loginType === 1"
                   @click="login.loginType = 2;login.password = '';errorTips.password = ''"
                   href="javascript:;"
                   class="switch-one switch-one-left">用短信验证码登录</a>
                <a v-if="login.loginType === 2"
                   @click="login.loginType = 1;login.password = '';errorTips.password = ''"
                   href="javascript:;"
                   class="switch-one switch-one-left">使用密码登录</a>
                <!--<a href="javascript:;" class="switch-one switch-one-right">忘记密码？</a>-->
              </div>
              <div class="form-btn">
                <a @click="handleLogin" class="btn-large" href="javascript:;">登录</a>
              </div>
              <div class="other-account">
                <div>其他社交账号登陆</div>
                <div @click="handleMsg()">
                  <a href="javascript:void(0)" class="weibo"></a>
                  <a href="javascript:void(0)" class="weixin"></a>
                  <a href="javascript:void(0)" class="qq"></a>
                </div>
              </div>
              <div class="go-reg">还没有账号？<a href="/user/reg">去注册</a>！</div>
            </el-tab-pane>
            <!--<el-tab-pane label="注册" name="second" :disabled="true">
              注册
            </el-tab-pane>-->
          </el-tabs>

        </div>
        <div class="download">
          <a target="_blank" href="/">下载APP</a>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </section>
</template>

<script>
  import { setToken, removeToken, removeUserInfo, setUserInfo } from '@/utils/auth'
  import { loginV2, sendSms } from '@/api/login'
  import Header from '@/components/Base/Header'
  import Footer from '@/components/Base/UserFooter'
  import { Message } from 'element-ui'
  import { generalLogDot } from '@/utils/log-dot'

  export default {
    name: 'login',
    components: {
      Header,
      Footer
    },
    data () {
      return {
        showWechat: false,
        sendCodetime: 60,
        sendCodeDisabled: false,
        activeName: 'first',
        passwordType: 'password',
        errorTips: {
          username: '',
          password: ''
        },
        login: {
          loginType: 1, // 登录方式：1、密码登录；2、短信验证码登录 ,
          password: '', // 密码登录
          username: '' // 密码登录
        }
      }
    },
    created () {
      // 到此页面，重新登录
      removeToken()
      removeUserInfo()
    },
    methods: {
      handleShow () {
        this.isShowPreview = !this.isShowPreview
        // this.isShowPreview = true
      },
      validateUserName (userName) {
        if (!userName) {
          this.errorTips.username = '未输入手机号'
          Message({
            message: this.errorTips.username,
            type: 'error',
            duration: 5 * 1000
          })
          return false
        } else {
          const re = /^[1][1,3,4,5,7,8][0-9]{9}$/
          if (re.test(userName)) {
            this.errorTips.username = ''
            return true
          } else {
            this.errorTips.username = '手机号格式错误'
            Message({
              message: this.errorTips.username,
              type: 'error',
              duration: 5 * 1000
            })
            return false
          }
        }
      },
      validatePassWord (password) {
        if (!password) {
          this.errorTips.password = '请输入密码'
          Message({
            message: this.errorTips.password,
            type: 'error',
            duration: 5 * 1000
          })
          return false
        } else {
          const re = /^[\w]{6,16}$/
          if (re.test(password)) {
            this.errorTips.password = ''
            return true
          } else {
            if (this.login.loginType === 2) {
              this.errorTips.password = '验证码格式错误'
              Message({
                message: this.errorTips.password,
                type: 'error',
                duration: 5 * 1000
              })
              return false
            } else {
              this.errorTips.password = '密码格式错误'
              Message({
                message: this.errorTips.password,
                type: 'error',
                duration: 5 * 1000
              })
              return false
            }
          }
        }
      },
      handleLogin () {
        // 验证输入
        if (this.validateUserName(this.login.username) && this.validatePassWord(this.login.password)) {
          loginV2(this.login).then(response => {
            if (response.code === 200) {
              // 写入cookie
              setToken(response.data.token)
              setUserInfo(response.data.userInfoData)
              // ceshi
              /* let userInfoData = {
                'id': 234,
                'xfId': 641025,
                'username': '18588878278',
                'sex': 1,
                'appUser': {
                  'id': 138,
                  'userId': 234,
                  'nickname': '鼓励师',
                  'avatar': 'http://xf-gc-prod-oss.oss-cn-hangzhou.aliyuncs.com/jpeg/201803/14/152101004840373363.jpeg',
                  'profession': 1,
                  'professionInfos': [9, 12],
                  'company': '宇宙无敌美少女天团',
                  'profile': '让我朵蜜你…',
                  'gmtCreate': 1520923424000
                }
              }
              setUserInfo(userInfoData) */
              // 登陆打点
              generalLogDot({
                action: 'loginsuccess' // 操作标识
              }, function () {
                // 是否跳转到发布页
                let referrer = document.referrer
                if (referrer && referrer.indexOf('article-edit') !== -1) {
                  // 定向到用户首页
                  window.location.href = '/user/article-edit'
                } else {
                  // 定向到用户首页
                  window.location.href = '/user/'
                }
              })
            }
          })
        }
      },
      handleSendSms () {
        if (this.validateUserName(this.login.username)) {
          sendSms({ mobile: this.login.username, type: 1 }).then(response => { // type:1、用户登录；2、用户注册；3、重置密码
            if (response.code === 200) {
              this.countDown()
            } else {
              this.errorTips.username = response.msg
            }
          })
        }
      },
      countDown () {
        let that = this
        that.sendCodeDisabled = true
        let interval = window.setInterval(function () {
          if ((that.sendCodetime--) <= 0) {
            that.sendCodetime = 60
            that.sendCodeDisabled = false
            window.clearInterval(interval)
          }
        }, 1000)
      },
      showPassword () {
        if (this.passwordType === 'password') {
          this.passwordType = 'text'
        } else {
          this.passwordType = 'password'
        }
      },
      handleClick () {
      },
      handleMsg (msg) {
        if (!msg) {
          msg = '抱歉，网页当前仅支持使用账号登录，请使用app进行第三方登录'
        }
        Message({
          message: msg,
          type: 'info',
          duration: 5 * 1000
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .login {
    /deep/ {
      .el-tabs__header {
        width: 146px;
        margin: 0 auto;
        margin-bottom: 15px;
        .el-tabs__nav {
          text-align: center;
          width: 100%;
        }
        .el-tabs__item {
          font-size: 26px;
          width: 50%;
        }
        .el-tabs__nav-wrap::after {
          background-color: transparent;
        }
      }
      /*加入注册选项卡时去掉*/
      .el-tabs__active-bar {
        left: 36px;
      }
    }
    a {
      text-decoration: none;
      color: #000;
    }

    .main {
      min-height: calc(100vh - 138px);
      background: #F4F9FC;
      padding-bottom: 30px;
    }

    .form-container {
      width: 1200px;
      margin: 0 auto;
      text-align: center;
      background: url('/images/login-bg.png') center bottom no-repeat;
      padding-top: 0.1px;
    }

    .ui-form {
      display: inline-block;
      margin: 65px auto 0;
      padding: 35px 70px 70px;
      border: 1px solid #F1F1F1;
      border-radius: 8px;
      background: #fff;
      width: 462px;
      height: 490px;
      .form-tab {
        padding-bottom: 35px;
        border-bottom: 1px solid #E9E9E9;
        text-align: center;
        .tab-one {
          font-size: 36px;
          color: #000;
        }
      }
      .form-main {
        .form-item {
          position: relative;
          width: 100%;
          height: 60px;
          line-height: 60px;
          text-align: left;
          border-bottom: 1px solid #E9E9E9;
          .item-input {
            font-size: 16px;
            outline: none;
            border: none;
          }
          .item-input-large {
            width: 65%;
          }
          .item-input-small {
            width: 35%;
          }
          .eye {
            float: right;
            margin-top: 20px;
            margin-right: 10px;
            opacity: 0.7
          }
          input:-webkit-autofill {
            background-color: #fff !important;
            -webkit-box-shadow: inset 0 0 0 1000px white !important;
          }
          .item-error {
            float: right;
            font-size: 14px;
            color: #fa4a30;
          }
          .item-code {
            float: right;
            height: 40px;
            line-height: 40px;
            margin-top: 10px;
            padding-left: 15px;
            border-left: 1px solid #E9E9E9;
            font-size: 16px;
            color: #0b83ff;
          }
        }
      }
      .form-switch {
        position: relative;
        margin: 15px 0;
        overflow: hidden;
        .switch-one {
          font-size: 16px;
          color: #B8B8B8;
        }
        .switch-one-left {
          float: left;
        }
        .switch-one-right {
          float: right;
        }
      }
      .form-btn {
        height: 45px;
        line-height: 45px;
        margin-top: 20px;
        border-radius: 5px;
        background: #5bbeff;
        background: -webkit-gradient(linear, left top, right top, from(#317AFF), to(#68C3FF));
        background: linear-gradient(90deg, #317AFF, #68C3FF);
        .btn-large {
          display: block;
          color: #fff;
          font-size: 20px;
        }
      }
    }
    .other-account {
      font-size: 14px;
      color: #999;
      padding-top: 15px;
      text-align: center;;
      width: 100%;
      .weibo, .weixin, .qq {
        display: inline-block;
        width: 64px;
        height: 64px;
        background: url("/images/share-map.png") no-repeat;
        background-position: -5px 0;
        margin-top: 10px;
      }
      .weixin {
        background-position: -65px 0;
      }
      .qq {
        background-position: -125px 0;
      }
    }
    .download {
      width: 462px;
      margin: 0 auto;
      margin-top: 15px;
      a {
        display: block;
        line-height: 45px;
        text-align: center;
        background-color: #59aaff;
        border-radius: 30px;
        color: #fff;
      }
      a:hover {
        background-color: #539dff;
      }
    }
    input::-ms-clear {
      display: none;
    }
    input::-ms-reveal {
      display: none;
    }
    .go-reg {
      margin-top: 10px;
      color: #999;
      font-size: 14px;
      a {
        color: #539dff;
      }
      a:hover{ text-decoration: underline;}
    }

    @media screen and (max-height: 800px) {
      .form-container {
        transform: scale(0.85);
      }
      .ui-form {
        margin-top: 0;
      }
      .main {
        height: calc(100vh - 138px);
        min-height: auto;
      }
    }
  }

</style>