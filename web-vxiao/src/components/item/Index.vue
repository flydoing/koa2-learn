<template>
  <div :class="classes"
       @click="handle">
    <div class="vx-item-left">
      <slot name="number"></slot>
      <slot name="before"></slot>
      <slot>
        <div v-if="label"
             v-html="label"></div>
      </slot>
      <slot name="main"></slot>
    </div>
    <div class="vx-item-right">
      <slot name="remark">
        <div class="ellipsis"
             v-html="remark"></div>
      </slot>
      <slot name="after">
        <i class="ico ico-right"
           v-if="hasClick && hasArrow" />
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'item',
    props: {
      className: { type: String, default: 'vx-item-show' },
      noborder: { type: Boolean, default: false },
      hasClick: { type: Boolean, default: true },
      hasArrow: { type: Boolean, default: true },
      fullInput: { type: Boolean, default: false },
      label: [String, Number],
      remark: [String, Number]
    },
    created() {},
    components: {},
    data() {
      return {}
    },
    computed: {
      classes() {
        return [
          'vx-item',
          {
            [`${this.className}`]: !!this.className,
            [`no-border`]: this.noborder,
            [`is-click`]: this.hasClick,
            [`full-input`]: this.fullInput
          }
        ]
      }
    },
    methods: {
      handle() {
        if (this.hasClick) {
          this.$emit('click')
        }
      }
    }
  }
</script>
