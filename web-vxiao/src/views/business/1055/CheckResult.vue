<style lang="scss" scoped>
  @import '~scss/mixin';
  .commin-btn {
    @include flex;
    button {
      display: block;
      width: rem(250);
      height: rem(40);
      margin: rem(30) auto;
      line-height: rem(40);
      @include bch;
      font-size: rem(14);
      color: nth($font-color, 4);
      border-radius: rem(3);
      cursor: pointer;
      border: none;
      outline: none;
      &:hover {
        @include bc;
      }
    }
  }
  .text-color.disabled {
    color: #999;
  }
</style>

<template>
  <div class="vx-search">
    <!-- <scroller :height="h">
      <item :hasClick="false">
        <div slot="main">姓名</div>
        <input slot="remark"
               type="text"
               placeholder="必填"
               v-model="userName">
      </item>
      <item>
        <div slot="main">序列号</div>
        <input slot="remark"
               type="text"
               placeholder="必填"
               v-model="serilNumber">
      </item>
      <div class="commin-btn">
        <button @click="handleCheck">查询</button>
      </div>
    </scroller> -->
    <!-- <h4 class="title">报名查询</h4> -->
    <!-- <div class="search-wechat"
         v-if="!isShowPhone">
      <p class="wechat-loading">自动查询中...</p>
    </div> -->
    <div class="search-phone">
      <!-- <item :hasClick="false">
        <div slot="main">姓名</div>
        <input slot="remark"
               type="text"
               placeholder="必填"
               v-model="userName">
      </item> -->
      <item :hasClick="false">
        <div slot="main">手机号</div>
        <input slot="remark"
               type="text"
               placeholder="必填"
               v-model="phone">
      </item>
      <item :hasClick="false">
        <div slot="before">
          <input type="text"
                 class="code-input"
                 placeholder="输入验证码"
                 v-model="vcode">
        </div>
        <div slot="remark"
             :class="codeClass"
             @click="handleCount()"
             v-html="codeTimeInfo"></div>
      </item>
      <div class="commin-btn">
        <button @click="handleSearch">查询</button>
      </div>
    </div>
  </div>
</template>
<script>
import Api from './api'
export default {
  data() {
    return {
      userName: '',
      phone: '',
      vcode: '',
      codeTimeInfo: '获取验证码',
      codeTime: 60,
      codeCounting: false,
      showTips: false,
      showTipsCont: '',
      code: ''
    }
  },
  computed: {
    codeClass() {
      return {
        'text-color': true,
        disabled: this.codeCounting
      }
    }
  },
  mounted() {
    document.title = '报名查询'
  },
  methods: {
    handleCount() {
      this.getCode()
    },
    checkPhone() {
      let _this = this
      if (!/^1\d{10}$/.test(_this.phone)) {
        this.$message({
          type: 'warning',
          message: '请核对11位手机号'
        })
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
        this.$message({
          type: 'warning',
          message: '请核对4位验证码'
        })
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
      if (!this.checkPhone() || this.codeCounting) {
        return false
      }
      Api.getCode(this.phone).then(res => {
        if (res && res.code === '1') {
          this.onCodeTimeCount()
        }
      })
    },
    async handleSearch() {
      // if (this.userName === '') {
      //   this.$message({
      //     type: 'warning',
      //     message: '请输入姓名！'
      //   })
      //   return false
      // }
      if (!this.checkPhone()) {
        return false
      }
      if (!this.checkCode()) {
        return false
      }
      this.routePush({
        name: 'applyAppDetail',
        query: {
          msgId: this.routeQuery('msgId'),
          // serialNumber: this.serilNumber,
          // name: this.userName, // 改成手机号，验证码
          mobile: this.phone,
          vcode: this.vcode
        }
      })
    }
  }
}
</script>
