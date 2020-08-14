<template>
  <Overlay :show.sync="visible" :width="1000" :height="670" @close="handle" background="transparent">
    <div class="scan-template">
      <div class="banner" :style="bannerStyle">
        <div v-if="template" v-html="content"></div>
      </div>
      <div class="text-holder" v-if="image" v-html="content"></div>
    </div>
  </Overlay>
</template>
<script>
import R from '@/views/group/mixin'
export default {
  mixins: [R],
  props: {
    show: { type: Boolean, default: false },
    template: { type: Object },
    content: { type: String },
    image: { type: String }
  },
  data() {
    return { visible: this.show }
  },
  components: {},
  computed: {
    background() {
      if (this.template) {
        let tmp = this.template
        if (tmp.backgroundImg) {
          return `url('${this.url(tmp.backgroundImg)}') no-repeat center/cover`
        }
        return tmp.backgroundColor
      } else if (this.image) {
        return `url('${this.url(this.image)}') no-repeat center/cover`
      } else {
        return '#ffffff'
      }
    },
    bannerStyle() {
      let style = { background: this.background }
      if (this.template) {
        style['color'] = this.template.fontColor
        style['font-size'] = this.template.fontSize
      }
      return style
    }
  },
  methods: {
    handle() {
      this.$emit('update:show', false)
    }
  },
  watch: {
    show(val) { this.visible = val }
  }
}

</script>
<style lang="scss">
@import "~scss/_mixin";
.scan-template {
  position: relative;
  background: url('/static/vscreen.png') no-repeat;
  animation: fade-in .8s ease-out;
  width: 100%;
  height: 100%;
  padding: rem(47);
  .banner {
    padding: rem(10);
    width: rem(906);
    height: rem(508);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: justify;
  }
  .text-holder {
    background: rgba(0, 0, 0, .5);
    position: absolute;
    right: rem(57);
    bottom: rem(123);
    color: #FFF;
    padding: rem(5) rem(10);
    max-width: rem(250);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    text-align: justify;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
}

</style>
