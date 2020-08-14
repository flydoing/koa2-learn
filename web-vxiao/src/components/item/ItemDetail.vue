<template>
  <div :class="classes"
       @click="handle">
    <div class="before"
         v-if="$slots.before">
      <slot name="before"></slot>
    </div>
    <div class="logo"
         v-if="$slots.avatar">
      <slot name="avatar"></slot>
    </div>
    <div class="main">
      <div class="info">
        <div class="title"
             v-if="$slots.title">
          <slot name="title"></slot>
        </div>
        <div class="remark"
             v-if="$slots.remark">
          <slot name="remark"></slot>
        </div>
      </div>
      <div class="detail">
        <div class="content"
             v-if="$slots.content"
             :style="prefixStyle">
          <slot name="content"></slot>
        </div>
        <div class="describe"
             v-if="$slots.describe">
          <slot name="describe"></slot>
        </div>
      </div>
    </div>
    <div class="after"
         v-if="$slots.after">
      <slot name="after"></slot>
    </div>
    <div class="after"
         v-if="hasArrow">
      <span class="ico ico-right"></span>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      className: { type: String },
      noborder: { type: Boolean, default: false },
      hasClick: { type: Boolean, default: true },
      hasArrow: { type: Boolean, default: false },
      width: { type: Number, default: 280 }
    },
    computed: {
      classes() {
        return [
          'vx-item s',
          {
            [`${this.className}`]: !!this.className,
            [`no-border`]: this.noborder,
            [`is-click`]: this.hasClick
          }
        ]
      }
    },
    data() {
      return { prefixStyle: {} }
    },
    methods: {
      handle() {
        this.hasClick && this.$emit('click')
      }
    },
    mounted() {
      this.$nextTick(() => {
        let _w = this.width - 50 - 20 - 20
        this.prefixStyle = {
          width: `${_w}px`
        }
      })
    }
  }
</script>
