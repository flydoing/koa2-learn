<template>
  <transition name="overlay">
    <el-row type="flex"
            justify="center"
            :align="align"
            :class="prefixCls"
            @mousedown.native="handleClose"
            v-if="show">
      <el-col :span="span"
              class="overlay-body"
              :style="prefixStyle"
              @click.native.stop="handle"
              @mousedown.native.stop>
        <slot></slot>
      </el-col>
    </el-row>
  </transition>
</template>
<script>
  export default {
    props: {
      theme: { type: String, default: '' },
      align: { type: String, default: 'middle' },
      top: { type: [String, Number] },
      show: Boolean,
      height: { type: [String, Number] },
      width: { type: [String, Number] },
      span: { type: [String, Number], default: 10 },
      background: { type: [String] }
    },
    computed: {
      prefixCls() {
        return ['overlay', `${this.theme}`]
      },
      prefixStyle() {
        let style = {
          width: `${this.width}px`,
          height: `${this.height}px`
        }
        if (this.background) {
          style['background'] = `${this.background}!important`
        }
        if (this.top) {
          style['margin-top'] = `${this.top}px`
        }
        return style
      }
    },
    inheritAttrs: false,
    methods: {
      handleClose() {
        this.$emit('update:show', false)
        this.$emit('close')
      },
      handle() {}
    },
    mounted() {
      document.body.appendChild(this.$el)
    }
  }
</script>
<style lang="scss" scoped>
  .overlay {
    z-index: 1000;
    cursor: pointer;
    overflow: hidden;

    &-body {
      z-index: 999;
      padding: 0 rem(5);
      cursor: default;
      position: relative;
    }

    &.top {
      @include ai(flex-start);
    }

    &.white {
      background-color: rgba(255, 255, 255, 0.5);

      .overlay-body {
        box-shadow: 0 0 30px 5px rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
