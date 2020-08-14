<template>
  <div :ref="refId"
       :class="prefixCls"
       :style="prefixStyle">
    <div class='scroll-container'>
      <slot></slot>
    </div>
    <slot name="other"></slot>
  </div>
</template>
<script>
  import Scrollbar from 'smooth-scrollbar'
  import M from './mixin'
  export default {
    name: 'Scroller',
    mixins: [M],
    props: {
      refId: { type: [Number, String], default: '_scroll' },
      height: {
        type: [Number, String],
        default: 'auto'
      },
      width: {
        type: [Number, String],
        default: '100%'
      },
      hideX: { type: Boolean, default: false },
      hideY: { type: Boolean, default: false },
      bottom: { type: Boolean, default: false }
    },
    created() {},
    data() {
      return {
        scrollbar: null
      }
    },
    computed: {
      prefixStyle() {
        return {
          width: this.width,
          height: `${this.height}px`
        }
      },
      prefixCls() {
        return [
          `vx-scroller`,
          {
            [`vx-scroller-x-hide`]: this.hideX,
            [`vx-scroller-y-hide`]: this.hideY
          }
        ]
      }
    },
    methods: {},
    mounted() {
      this.$nextTick(() => {
        this.scrollbar = Scrollbar.init(this.$refs[this.refId], {
          alwaysShowTracks: false,
          damping: 0.2
        })
        this.scrollbar.addListener(status => {
          this.scrollIng(status)
        })
        // 是否滚动到最底部
        if (this.bottom) {
          this.scrollbar.scrollTop = this.scrollbar.limit.y
        }
      })
    }
  }
</script>
<style lang="scss">
  .vx-scroller {
    &-x-hide {
      .scrollbar-track-x {
        display: none !important;
      }
    }
    &-y-hide {
      .scrollbar-track-y {
        display: none !important;
      }
    }
    .scrollbar-track {
      background: none !important;
      &-y {
        right: rem(0);
        z-index: 999;
      }
      &-x {
        bottom: rem(2);
        z-index: 999;
      }
    }

    .scrollbar-thumb {
      background: nth($background, 5) !important;
      cursor: pointer;
    }
  }
</style>
