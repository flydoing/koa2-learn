<template>
  <div class="medal"
       @click="handle(medal)"
       :class="{'active': isActive}">
    <img :src="Image.IMG_EMPTY"
         v-lazy:background-image="logo"
         :style="imageStyle(logo)" />
  </div>
</template>
<script>
  export default {
    name: 'medal',
    props: {
      medal: { type: [Object] },
      isActive: false
    },
    components: {},
    computed: {
      logo() {
        return this.url(this.medal.logo)
      }
    },
    methods: {
      handle(medal) {
        this.$emit('click', medal)
      }
    }
  }
</script>
<style lang="scss">
  .medal {
    position: relative;
    width: rem(80);
    height: rem(80);
    margin: 0 0 rem(14) rem(14);
    background: #fafafa;
    float: left;
    border: rem(1) solid #ebebeb;
    border-radius: rem(5);
    padding: rem(5);
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 0;
      z-index: 998;
      border-radius: rem(5);
      background: #000;
      opacity: 0.5;
    }
    &.active:after,
    &:hover:after {
      height: 100%;
    }
  }
</style>
