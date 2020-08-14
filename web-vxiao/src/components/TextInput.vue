<template>
  <div class="vx-textarea">
    <textarea rows="3"
              v-bind:value="value"
              v-on:input="$emit('input', $event.target.value)"
              :placeholder="placeholder"
              :maxlength="maxlength"></textarea>
    <div class="vx-textarea-tip">
      <div class="tip"
           v-if="$slots.tip">
        <slot></slot>
      </div>
      <div class="count"
           v-if="max>0">{{value.length}}/{{max}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      value: { type: String, default: '' },
      placeholder: { type: String },
      max: { type: Number, default: 0 },
      tip: { type: String }
    },
    computed: {
      maxlength() {
        return this.max > 0 ? this.max : 10000
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-textarea {
    background: nth($background, 6);
    border-bottom: $border;
    textarea {
      padding: rem(8) nth($padding, 2);
      width: 100%;
      border: 0;
    }
    &-tip {
      line-height: rem(25);
      font-size: rem(12);
      overflow: hidden;
      & > div {
        padding: rem(0) nth($padding, 3);
        &.tip {
          float: left;
          color: nth($font-color, 5);
        }
        &.count {
          float: right;
        }
      }
    }
  }
</style>
