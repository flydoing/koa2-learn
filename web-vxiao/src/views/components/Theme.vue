<template>
  <div class="vx-theme"
       :class="{'active':show}">
    <div class="vx-theme-btn theme-Icon"
         @click="show=!show"></div>
    <div class="vx-theme-box">
      <img v-lazy="{src:'/static/bg/add_bg.png'}"
           alt='ADD' />
      <img v-lazy="{src:url(custom.imageId,'thumb'),error:'/static/bg/bg.jpg'}"
           v-for="(custom,i) in getCustomThemes"
           :key="i"
           @click="handle(custom)" />
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['getCustomThemes', 'getMetaDatas']),
      currentMeta() {
        return this.getMetaDatas.filter(m => {
          return m.metaType === 'm_background'
        })
      }
    },
    data() {
      return { show: false }
    },
    created() {
      this.loadCustomThemes()
    },
    methods: {
      ...mapActions(['loadCustomThemes', 'modifyMetaData']),
      handle(theme) {
        this.modifyMetaData({ ...this.currentMeta, obj: theme.imageId })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-theme {
    position: absolute;
    top: rem(20);
    right: rem(-160);
    z-index: 100;
    transition: all ease-out 0.3s;
    &.active {
      right: rem(5);
    }
    &-btn {
      float: left;
      margin-top: rem(5);
      background-color: rgba(144, 144, 144, 0.5);
      width: rem(30);
      height: rem(30);
      border-bottom-left-radius: rem(30);
      border-top-left-radius: rem(30);
    }
    &-box {
      width: rem(160);
      background-color: rgba(144, 144, 144, 0.5);
      border-radius: rem(3);
      float: left;
      img {
        width: rem(70);
        height: rem(40);
        margin: rem(5);
        float: left;
        cursor: pointer;
        border-radius: rem(3);
      }
    }
  }
</style>
