<template>
  <Overlay :show.sync="visible" :width="1000" :height="670" @close="handle" background="transparent">
    <div class="scan-template">
      <div class="banner" :style="{'color': template.fontColor,'font-size': template.fontSize,'background':background}" v-html="content"></div>
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
    content: { type: String }
  },
  data() {
    return { visible: this.show }
  },
  components: {},
  computed: {
    background() {
      let tmp = this.template
      if (tmp.backgroundImg) {
        return `url('${this.url(tmp.backgroundImg)}') no-repeat center/cover`
      }
      return tmp.backgroundColor
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
}

</style>
