<template>
  <div :class="classes"
       @click="handle">
    <div class="vx-item-left">
      <slot name="before"></slot>
      <slot name="avatar"></slot>
      <div class='vx-item-info'>
        <div class="title">
          <slot name="title"></slot>
        </div>
        <div class="main">
          <slot name="main"></slot>
        </div>
      </div>
    </div>
    <div class="vx-item-right">
      <div class="vx-item-detail">
        <div class="remark">
          <slot name="remark"></slot>
        </div>
        <div class="describe">
          <slot name="describe"></slot>
        </div>
      </div>
      <slot name="after">
        <i class="ico ico-right"
           v-if="hasClick" />
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'itemList',
    props: {
      className: { type: String },
      noborder: { type: Boolean, default: false },
      hasClick: { type: Boolean, default: true }
    },
    created() {},
    components: {},
    data() {
      return {}
    },
    computed: {
      classes() {
        return [
          'vx-item vx-item-list',
          {
            [`${this.className}`]: !!this.className,
            [`no-border`]: this.noborder,
            [`is-click`]: this.hasClick
          }
        ]
      }
    },
    methods: {
      handle() {
        this.hasClick && this.$emit('click')
      }
    }
  }
</script>
