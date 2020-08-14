<template>
  <div class='page-404'>
    <img :src="img"
         alt="404">
    <div class="text">非常抱歉，您所访问的网页找不到了！您可以选择
      <router-link to="/vx/index">返回首页</router-link>
    </div>
  </div>
</template>
<script>
  import * as img from '@/assets/images/404.png'
  export default {
    name: 'errorPage',
    data() {
      return {
        img: img
      }
    },
    created() {
      this.offPage(false)
    }
  }
</script>
<style lang="scss" scoped>
  .page-404 {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #ededed;
    @include fs(18);
    @extend %flex;
    @include jc;
    @include ai;
  }
</style>
