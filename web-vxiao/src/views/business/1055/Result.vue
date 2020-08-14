<template>
  <div class="vx-result">
    <!-- <h4 class="title">提交成功</h4> -->
    <div class='sign-success'>
      <img :src='icoSuccess' />
      <div class="title">提交成功</div>
    </div>
    <!-- <p>我们将在一个工作日内完成审核<br>请留意短信通知或关注“东风东路小学”公众号消息</p>
    <img src="/static/images/vx_gongzonghao.jpg"
         alt="">
    <p>长按二维码关注</p> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      resultType: 1,
      icoSuccess: `/static/ico/ico_success.png`
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
  .sign-success {
    text-align: center;
    img {
      margin-bottom: rem(15);
    }
  }
  .title {
    text-align: center;
    margin: rem(20) auto;
    font-size: 24px;
  }
  .vx-result {
    padding: rem(20) rem(25);
    text-align: center;
    img {
      display: block;
      max-width: 100px;
      margin: 0 auto;
    }
    .color-green {
      color: #00c162;
    }
  }
</style>
