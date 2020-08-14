<template>
  <div class="medal-02"
       :class="{'flunk': md.score <= 0}"
       @click="handle">
    <div class="md-content">
      <div class="md-logo"
           v-lazy:background-image="logo"
           :style="imageStyle(logo)"></div>
      <div class="md-name">{{md.name}}</div>
      <div class="md-score">{{md.value}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'medal',
    props: {
      medal: { type: [Object] }
    },
    computed: {
      md() {
        return this.medal
      },
      logo() {
        return this.url(this.medal.logo)
      }
    },
    methods: {
      handle() {
        this.$emit('click')
      }
    }
  }
</script>
<style lang="scss">
  .medal-02 {
    width: rem(100);
    height: rem(100);
    margin: 0 rem(5) rem(5) 0;
    float: left;
    cursor: pointer;
    border: rem(1) solid #f3f3f3;
    .md-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      @include borderColor;
      width: rem(100);
      height: rem(100);
      float: left;
    }

    .md-logo {
      width: rem(35);
      height: rem(35);
      margin: rem(10) auto;
      border: none;
      background-size: cover;
    }
    .md-name {
      width: rem(100);
      height: rem(20);
      line-height: rem(20);
      text-align: center;
      border: none;
    }
    .md-score {
      position: absolute;
      right: rem(4);
      top: rem(4);
      height: rem(20);
      line-height: rem(20);
      border: none;
      @include fc;
    }
    &.flunk {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .md-content {
        border-color: red !important;
      }
      .md-score {
        color: red;
      }
    }
  }
</style>
