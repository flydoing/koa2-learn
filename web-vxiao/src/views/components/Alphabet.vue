<template>
  <div class="vx-alphabet"
       ref="_tt">
    <div>
      <label v-for="index in indexs"
             :key="index"
             @click="$emit('click',index)"
             title="index">{{index}}</label>
    </div>
  </div>
</template>
<script>
  export default {
    props: { indexs: Array },
    data() {
      return { alphabetHeight: '' }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';
  .vx-alphabet {
    position: absolute;
    top: 0;
    bottom: 0;
    right: rem(2);
    @include flex;
    @include ai;
    div {
      border-radius: rem(10);
      padding: rem(10) rem(7);
      background: nth($background, 2);
      label {
        text-align: center;
        font-size: rem(12);
        line-height: rem(14);
        display: block;
        cursor: pointer;
        color: nth($font-color, 7);
      }
    }
  }
</style>
