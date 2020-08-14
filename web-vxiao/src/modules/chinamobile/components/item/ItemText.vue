<template>
  <div :class="prefixCss"
       @click="handle($event)">
    <div class="com-cell block item-text-blue">
      <slot name="text">{{d.text}}</slot>
    </div>
    <div class="com-cell after">
      <slot name="after"></slot>
    </div>
    <div class="com-cell icon">
      <slot name="ico">
        <i class="ico"
           :class="icon"></i>
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      item: {
        type: [Object],
        default: function() {
          return {}
        }
      },
      icon: { type: [String], default: '' },
      border: { type: [Boolean], default: true },
      hasClick: { type: [Boolean], default: true },
      cls: { type: String, default: '' }
    },
    data() {
      return { d: this.item }
    },
    computed: {
      prefixCss() {
        return ['com-table item-text1', this.cls, this.d.cls, { 'has-click': this.hasClick }]
      }
    },
    methods: {
      handle: function($event) {
        this.$emit('click', this.item, $event)
      }
    },
    watch: {
      d(v) {}
    }
  }
</script>
<style lang="scss">
  .item-text1 {
    z-index: 100;
    padding: 0 rem(15);
    line-height: rem(35);
    position: relative;
    .com-cell {
      padding: rem(0) !important;
      text-align: left !important;
    }
    .icon {
      width: rem(30);
      text-align: right !important;
    }
    &:hover,
    &.active {
      // color: #ffffff !important;
      // @include bc;
      @include fc;
      background-color: #ffffff;
      .ico {
        @include fc;
      }
      .item-text-blue span {
        @include fc;
      }
    }
  }
</style>
