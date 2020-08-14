<template>
  <div class="result">
    <page :titleBorder="false">
      <div slot="main">
        <div class="result-title">
          <img :src="icoSuccess">
          <p>报名信息已经成功提交</p>
        </div>
        <item>
          <div slot="main">报名序列号</div>
          <div slot="remark"
               class="keyCode ellipsis">{{key}}</div>
          <span slot="after"></span>
        </item>
        <p class="result-warning">
          请牢记报名序号，以便查询！！！请勿泄 露报名序号及报名信息，以免报名信息遭 篡改！！！
        </p>
        <div class="commin-btn">
          <button @click="handleCheck">查询</button>
        </div>
      </div>
    </page>
  </div>
</template>
<script>
  export default {
    created() {
      this.key = this.routeQuery('serialNumber')
    },
    data() {
      return {
        key: '',
        icoSuccess: `/static/ico/ico_success.png`
      }
    },
    methods: {
      handleCheck() {
        this.routePush({
          name: 'applyCheckResult',
          query: {
            msgId: this.routeQuery('msgId'),
            serialNumber: this.routeQuery('serialNumber')
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .result-title {
    text-align: center;
    padding: rem(30) 0;
    font-size: rem(20);
    img {
      display: block;
      margin: rem(10) auto;
      width: 20%;
    }
  }

  .keyCode {
    padding-right: rem(10);
  }

  .result-warning {
    padding: rem(10);
    font-size: rem(14);
    color: red;
    text-align: center;
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
