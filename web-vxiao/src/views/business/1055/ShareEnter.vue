<template>
  <div class="share-enter">
    <page :titleBorder="false">
      <div slot="header" class="right-Icon right"></div>
      <div slot="main">
        <div class="banner">
          <p class="banner-text">
            马上测试学校
            <br>2018年秋季学期新生班报名
            <br>截止时间：9月1日
          </p>
        </div>
        <item @click='handleApply'>
          <div slot="main">立即报名</div>
        </item>
        <item>
          <div slot="main">查询报名信息</div>
        </item>
      </div>
    </page>
  </div>
</template>
<script>
  export default {
    methods: {
      handleApply() {
        // /html5/vx/business/1055/applyDetail/?userId=5694313&clientId=web5694313&refId=56943132018525172538515&token=5694313%3A2C57D34788A1467DDACBACBBC21C97EA&msgId=34364188
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .banner{
    border-bottom: 1px solid #EDEDED ;
  }
  .banner {
    @include flex;
    @include jc;
    @include ai;
    padding: rem(10);
    .banner-text {
      text-align: center;
    }
  }

</style>
