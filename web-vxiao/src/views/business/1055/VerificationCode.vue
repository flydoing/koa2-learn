<template>
  <scroller :height="h">
    <div class="main">
      <div class="input">
        <input type="text"
               placeholder="输入右图验证码"
               v-model="code">
      </div>
      <div class="pic">
        <img :src="codeUrl"
             alt="验证码"
             class="code-img">
      </div>
      <div class="btn">
        <div @click.self="getSrc">换一张</div>
      </div>
    </div>
    <div class="commin-btn">
      <button @click="handleNext">下一步</button>
    </div>
  </scroller>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Api from './api'
  export default {
    data() {
      return {
        code: '',
        ids: new Date().getTime().toString() + (Math.random() * 1000000).toFixed(0).toString(),
        codeUrl: ''
      }
    },
    created() {
      this.codeUrl = '/base/aas/verifycode?ts=' + this.ids
    },
    methods: {
      getSrc() {
        this.codeUrl = ''
        this.codeUrl = '/base/aas/verifycode?ts=' + this.ids + '&' + new Date().getTime()
      },
      handleNext() {
        let that = this
        let reqObj = {}
        reqObj.ts = this.ids
        reqObj.code = this.code
        reqObj.enroll = this.cacheData
        Api.commitTable(reqObj).then(res => {
          if (res) {
            if (res.code === '1') {
              this.routePush({
                name: 'applyResult',
                query: {
                  serialNumber: res.enroll.fromClientId,
                  msgId: this.routeQuery('msgId')
                }
              })
            }
          } else {
            that.getSrc()
          }
        })
      }
    },
    computed: {
      ...mapGetters({
        cacheData: 'getCacheData'
      })
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  * {
    padding: 0;
    margin: 0;
  }

  .main {
    @include flex;
    @include ai;
    height: 65px;
    padding: rem(10) 0;
    border-bottom: 1px solid #ededed;
    .input {
      input {
        display: block;
        width: 96%;
        padding-left: 8px;
        border: none;
        height: 45px;
        line-height: 45px;
      }
    }
    .pic {
      margin: 0 rem(10);
      .code-img {
        height: 45px;
      }
    }
    .btn {
      div {
        width: rem(60);
        text-align: center;
        height: rem(45);
        line-height: rem(45);
        background-color: #ccc;
        border-radius: rem(3);
        cursor: pointer;
        &:hover {
          background-color: #ededed;
        }
      }
    }
  }

  .commin-btn {
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
</style>
