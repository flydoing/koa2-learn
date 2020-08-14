<!-- Switch 开关 -->
<template>
  <span :class="wrapClasses"
        @click.stop="toggle">
    <span :class="innerClasses">
      <slot name="open"
            v-if="currentValue === trueValue"></slot>
      <slot name="close"
            v-if="currentValue === falseValue"></slot>
    </span>
  </span>
</template>
<script>
  const prefixCls = 'vx-switch'
  export default {
    props: {
      value: { type: [String, Boolean, Number], default: false },
      trueValue: { type: [String, Boolean, Number], default: true },
      falseValue: { type: [String, Boolean, Number], default: false },
      size: { type: String, default: 'large' },
      disabled: { type: Boolean, default: false }
    },
    data() {
      return {
        currentValue: this.value
      }
    },
    computed: {
      wrapClasses() {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-checked`]: this.currentValue === this.trueValue,
            [`${prefixCls}-disabled`]: this.disabled,
            [`${prefixCls}-${this.size}`]: !!this.size
          }
        ]
      },
      innerClasses() {
        return `${prefixCls}-inner`
      }
    },
    methods: {
      toggle() {
        if (this.disabled) {
          this.$emit('disabled')
          return false
        }
        const checked = this.currentValue === this.trueValue ? this.falseValue : this.trueValue
        this.currentValue = checked
        this.$emit('update:value', checked)
        this.$emit('click', checked, this.currentValue)
      }
    },
    watch: {
      value(v) {
        this.currentValue = v
      }
    }
  }
</script>
<style lang="scss">
  .vx-switch {
    display: inline-block;
    width: rem(40);
    height: rem(23);
    vertical-align: middle;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    background-color: nth($background, 5);
    @include borderRadius(rem(12));
    @include prefixer(user-select, none);
    @include after(2, 2) {
      width: rem(19);
      height: rem(19);
      border-radius: 50%;
      background-color: nth($background, 6);
      cursor: pointer;
      transition: left nth($time, 2) ease-in-out, width nth($time, 2) ease-in-out;
    }
    &:active::after {
      width: rem(19);
    }
    &.vx-switch-checked {
      @include bc;
      &:after {
        left: rem(19);
      }
      &:active::after {
        left: rem(19);
      }
    }

    &-small {
      width: rem(30);
      height: rem(18);
      &:after {
        width: rem(14);
        height: rem(14);
        left: 2;
        top: 2;
      }
      &:active::after {
        width: rem(14);
      }
      &.vx-switch-checked {
        @include bc;
        &:after {
          left: rem(14);
        }
        &:active::after {
          left: rem(14);
        }
      }
    }
  }
</style>
