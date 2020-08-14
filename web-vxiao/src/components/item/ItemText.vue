<template>
  <div :class="prefixCss"
       @click="handle($event)">
    <div class="com-cell icon"
         v-if="hasIcon">
      <slot name="ico">
        <span :class="{'arrowRotate':isArrowRotate}">
          <i class="ico"
             :class="icon"></i>
        </span>
      </slot>
    </div>
    <div class="com-cell block">
      <slot name="text">{{d.text}}</slot>
    </div>
    <div class="com-cell after">
      <slot name="after"></slot>
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
      cls: { type: String, default: '' },
      isArrowRotate: { type: [Boolean], default: false },
      hasIcon: { type: [Boolean], default: true }
    },
    data() {
      return { d: this.item }
    },
    computed: {
      prefixCss() {
        return ['com-table item-text', this.cls, this.d.cls, { 'has-click': this.hasClick }]
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
  .item-text {
    z-index: 100;
    padding: 0 rem(15);
    line-height: rem(35);
    position: relative;
    .icon {
      width: rem(30);
    }
    .com-cell {
      padding: rem(0) !important;
      text-align: left !important;
    }
    &:hover,
    &.active {
      color: #ffffff !important;
      @include bc;
      .ico {
        color: #ffffff;
      }
    }
    &:hover,
    &.bg-gray {
      color: #6c757d !important;
      background: rgba(233, 244, 255, 1) !important;
      .ico {
        color: #6c757d !important;
      }
    }
    &:hover,
    &.bg-blue {
      color: #fff !important;
      @include bc;
    }
    &.group-lineheight {
      line-height: rem(40);
    }
  }
  .arrowRotate {
    transform: rotate(90deg);
    display: inline-block;
    transition: all 0.3s;
  }
</style>
