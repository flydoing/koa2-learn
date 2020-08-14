<template>
  <div class="tips-box">
    <div>
      <img v-lazy="{src:'/static/ico/icon_commoneuse.png'}"
           alt="" />
      <p :style="textStyle">{{text}}</p>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      text: {
        type: String,
        default: '暂无内容'
      },
      fontSize: {
        type: String
      }
    },
    computed: {
      textStyle() {
        return this.fontSize ? { 'font-size': `${this.fontSize}px` } : {}
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .tips-box {
    @include flex;
    @include jc;
    @include ai;
    height: rem(300);
    background-color: #fff;
    div {
      img {
        display: block;
        margin: 0 auto;
      }
      p {
        margin-top: rem(20);
        font-size: rem(16);
        color: #9f9f9f;
      }
    }
  }
</style>
