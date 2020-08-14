<template>
  <div class="vx-dialog-container">
    <div class="vx-dialog"
         :style="style"
         ref="_dialog">
      <div class="vx-dialog-header">
        <div class="vx-dialog-title">{{title}}</div>
        <div class="vx-dialog-button">
          <slot name="button"></slot>
          <div v-if="hasReturn"
               class="return-Icon"
               @click="clickReturn"></div>
          <div v-if="hasClose"
               class="close-Icon right"
               @click="clickClose"></div>
        </div>
      </div>
      <div class="vx-dialog-body"
           ref="_body">
        <slot name="top"></slot>
        <scroller :height="scrollHeight"
                  @scrollEnd="scrollEnd">
          <slot></slot>
        </scroller>
      </div>
      <div class="vx-dialog-footer"
           v-if="$slots.footer"
           ref="_footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'DialogPage',
    props: {
      name: {
        type: [String, Number]
      },
      title: {
        type: String,
        default: ''
      },
      beforeClose: Function,
      hasReturn: {
        type: Boolean,
        default: false
      },
      hasClose: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        currentName: this.name,
        width: 450,
        height: (this.innerHeight / 3) * 2
      }
    },
    computed: {
      style() {
        return {
          width: `${this.width}px`,
          height: `${this.height}px`
        }
      },
      scrollHeight() {
        return this.height - 40
      }
    },
    methods: {
      clickReturn() {
        this.$emit('retrunButton')
        this.$parent.return()
      },
      clickClose() {
        this.$parent.close()
      },
      updataDialog() {
        this.$parent.updataDialog()
      },
      scrollEnd(status) {
        this.$emit('scrollEnd', status)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.updataDialog()
      })
    },
    destroyed() {
      this.updataDialog()
    },
    watch: {}
  }
</script>
<style lang="scss">
  .vx-dialog {
    background: #fff;
    border-radius: rem(3);
    &-header {
      position: relative;
      height: rem(40);
      border-bottom: $border;
      @include fc;
    }
    &-title {
      position: absolute;
      top: rem(0);
      left: rem(0);
      width: 100%;
      text-align: center;
      line-height: rem(40);
      cursor: pointer;
    }
    .right {
      float: right;
    }
  }

  .el-message-box__wrapper {
    z-index: 20001 !important;
  }
</style>
