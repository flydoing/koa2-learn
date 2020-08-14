<template>
  <div class="pwd-page">
    <div class="pwd-container">
      <header>
        <!-- <img src="/static/logo.png" /> -->
        <div>已有账号?<span class="text-color"
                @click="login">马上登录</span></div>
      </header>
      <div class="pwd-block">
        <div class="pwd-title">找回密码</div>
        <div class="pwd-main">
          <template v-if="activated===1">
            <div class="block"
                 :class="{'error':mobileError.length > 0}">
              <input placeholder="输入手机号码或学号"
                     v-model="mobile"
                     maxlength="15"
                     @blur="mobileBlur" />
              <div class="error-message">{{mobileError}}</div>
            </div>
            <div class="block"
                 :class="{'error':codeError.length > 0}">
              <input placeholder="输入右图验证码"
                     v-model="code"
                     @blur="codeBlur" />
              <img :src="qrCode" />
              <div class="change"
                   @click="ts=new Date().getTime()">换一张</div>
              <div class="error-message">{{codeError}}</div>
            </div>
          </template>
          <template v-else-if="activated===2">
            <Scroller :height="400">
              <template v-if="departments.length > 0">
                <div class="category-title text">部门</div>
                <Item v-for="d in departments"
                      :key="d.groupId"
                      @click="selectGroup = d">
                  <div>{{d.name}}</div>
                  <div slot="after">
                    <i class="ico ico-select"
                       :class="{'active':selectGroup.groupId===d.groupId}"></i>
                  </div>
                </Item>
              </template>
              <template v-for="c in campuses">
                <div class="category-title text"
                     :key="c.id">{{c.name}}</div>
                <div v-for="g in c.grades"
                     :key="g.id">
                  <Item v-for="cg in g.classes"
                        :key="cg.name"
                        @click="selectGroup = cg">
                    <div>{{cg.name}} - {{g.name}}</div>
                    <div slot="after">
                      <i class="ico ico-select"
                         :class="{'active':selectGroup.groupId===cg.groupId}"></i>
                    </div>
                  </Item>
                </div>
              </template>
              <Item :hasClick="false"
                    fullInput>
                <input placeholder="输入学生全名（必填）"
                       v-model="studentName" />
              </Item>
            </Scroller>
          </template>
          <template v-else-if="activated===3">
            <div class="block"
                 :class="{'error':mobileError.length > 0}"
                 v-if="!isMobile">
              <input placeholder="输入家长手机号码"
                     v-model="parentMobile"
                     maxlength="11"
                     @blur="parentMobileBlur" />
            </div>
            <div class="block"
                 :class="{'error':smsError.length > 0}">
              <input placeholder="输入短信验证码"
                     v-model="sms"
                     @blur="smsBlur" />
              <div :class="[{'change': true,'invalid': second < 120}]"
                   @click="getSMS">{{smsText}}</div>
              <div class="error-message">{{smsError}}</div>
            </div>
          </template>
          <template v-else-if="activated===4">
            <div class="block"
                 :class="{'error':smsError.length > 0}">
              <input type="password"
                     placeholder="输入新密码"
                     v-model="pwd"
                     @blur="pwdBlur" />
              <div class="error-message">{{pwdError}}</div>
            </div>
            <div class="block"
                 :class="{'error':smsError.length > 0}">
              <input type="password"
                     placeholder="确认新密码"
                     v-model="confirmPwd"
                     @blur="confirmPwdBlur" />
              <div class="error-message">{{confirmPwdError}}</div>
            </div>
          </template>
          <template v-else>
            <div>
              <h3>密码重置成功，<span class="text-color"
                      @click="login">马上登录</span></h3>
            </div>
          </template>
          <template v-if="activated!==5">
            <div class="button"
                 @click="next">下一步</div>
            <div class="text-color"
                 v-if="activated > 1"
                 style="margin:0"
                 @click="back">返回</div>
          </template>
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
  import Check from '@/utils/check'
  import encryptUtil from '@/utils/encrypt'
  export default {
    data() {
      return {
        step: 1,
        mobileError: '',
        codeError: '',
        smsError: '',
        pwdError: '',
        confirmPwdError: '',
        mobile: '',
        code: '',
        studentName: '',
        parentMobile: '',
        ts: new Date().getTime(),
        activated: 1,
        second: 120,
        relation: {},
        departments: [],
        campuses: [],
        selectGroup: {},
        sms: '',
        pwd: '',
        confirmPwd: ''
      }
    },
    computed: {
      qrCode() {
        return `/base/aas/verifycode.json?ts=${this.ts}`
      },
      isMobile() {
        return this.mobile.length === 11
      },
      smsText() {
        return this.second === 120 ? '发送验证码' : `${this.second}秒`
      },
      isThirdparty() {
        return this.$route.path === '/passwordThirdparty'
      }
    },
    methods: {
      login() {
        this.routeBack()
      },
      next() {
        if (this.activated === 1) {
          // 如果是11位，则代表走手机号码流程
          // 如果是15位，则代表走学号验证流程，首先查询该学号对应的用户是否存在
          if (this.mobileBlur() && this.codeBlur()) {
            let loading = this.$loading({ target: '.pwd-block' })
            let timeStamp = new Date().getTime()
            let headers = {
              ...this.$http.defaults.headers,
              common: {
                ...this.$http.defaults.headers.common,
                MFDate: timeStamp,
                ClientId: `web${this.mobile}`,
                encryVer: '1.0'
              }
            }
            Api.checkAccount(encryptUtil.encrypt(this.mobile, timeStamp), headers, this.code, this.ts)
              .then(res => {
                if (!this.isMobile) {
                  this.activated = 2
                  this.relation = res.relation
                  this.departments = res.groupMap.departments || []
                  this.campuses = res.groupMap.campuses || []
                } else {
                  this.activated = 3
                }
                loading.close()
              })
              .catch(() => {
                loading.close()
              })
          }
        } else if (this.activated === 2) {
          if (Check.isNullString(this.studentName)) {
            this.$message({ type: 'warning', message: '请输入学生姓名!' })
            return
          }
          if (Check.isNullObject(this.selectGroup)) {
            this.$message({ type: 'warning', message: '请选择班级!' })
            return
          }
          let loading = this.$loading({ target: '.pwd-block' })
          Api.checkUserByNo({
            relation: {
              name: this.studentName,
              groupId: this.selectGroup.groupId,
              studentNo: this.mobile,
              userId: this.relation.userId
            }
          })
            .then(res => {
              loading.close()
              this.relation = res.relation
              this.activated = 3
            })
            .catch(res => {
              loading.close()
            })
        } else if (this.activated === 3) {
          if (!this.isMobile && !this.parentMobileBlur()) {
            return
          }
          if (this.smsBlur()) {
            let loading = this.$loading({ target: '.pwd-block' })
            Api.checkSMSCode(this.mobile, this.sms)
              .then(res => {
                this.activated = 4
                loading.close()
              })
              .catch(() => {
                loading.close()
              })
          }
        } else if (this.activated === 4) {
          if (this.pwdBlur() && this.confirmPwdBlur()) {
            let mobile = this.isMobile ? this.mobile : this.parentMobile
            let timeStamp = new Date().getTime()
            let headers = {
              ...this.$http.defaults.headers,
              common: {
                ...this.$http.defaults.headers.common,
                MFDate: timeStamp,
                ClientId: `web${mobile}`,
                encryVer: '1.0'
              }
            }
            let loading = this.$loading({ target: '.pwd-block' })
            Api.forgetPwd(
              {
                relation: this.isMobile ? void 0 : this.relation,
                validate: {
                  mobile: encryptUtil.encrypt(mobile, timeStamp),
                  vcode: this.sms,
                  newPwd: encryptUtil.encrypt(this.pwd, timeStamp)
                }
              },
              headers
            )
              .then(res => {
                loading.close()
                this.activated = 5
              })
              .catch(res => {
                loading.close()
              })
          }
        }
      },
      back() {
        if (this.activated === 2 || this.activated === 3) {
          this.activated = 1
        } else {
          this.activated = this.isMobile ? 3 : 2
        }
      },
      mobileBlur() {
        if (this.mobile.length === 11) {
          var reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/
          if (this.mobile === '') {
            this.mobileError = '请输入手机号码'
            return false
          } else if (!reg.test(this.mobile)) {
            this.mobileError = '手机号码格式不正确'
            return false
          }
        } else if (this.mobile.length < 11) {
          this.mobileError = '手机号码或者学号格式不正确'
          return false
        }
        this.mobileError = ''
        return true
      },
      codeBlur() {
        if (this.code === '') {
          this.codeError = '请输入图片验证码'
          return false
        }
        this.codeError = ''
        return true
      },
      smsBlur() {
        if (this.sms === '') {
          this.smsError = '短信验证码为空'
          return false
        }
        this.smsError = ''
        return true
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
      },
      parentMobileBlur() {
        if (this.parentMobile.length === 11) {
          var reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/
          if (this.mobile === '') {
            this.parentMobileError = '请输入手机号码'
            return false
          } else if (!reg.test(this.parentMobile)) {
            this.parentMobileError = '手机号码格式不正确'
            return false
          }
        } else if (this.parentMobile.length < 11) {
          this.parentMobileError = '手机号码或者学号格式不正确'
          return false
        }
        this.parentMobileError = ''
        return true
      },
      getSMS() {
        let that = this
        this.smsError = ''
        // 如果是学号流程，且家长手机号码错误
        if (this.isMobile && this.parentMobileBlur()) {
          return
        }
        // 如果图形验证码错误
        if (!this.codeBlur()) {
          return
        }
        // 云端发送手机验证码
        Api.getSMSCode(this.isMobile ? this.mobile : this.parentMobile, this.code, this.ts)
        let interval = setInterval(() => {
          if (that.second === 0) {
            that.second = 120
            clearInterval(interval)
            return
          }
          that.second--
        }, 1000)
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
