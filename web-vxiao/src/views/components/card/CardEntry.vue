<template>
  <div class="com-table vx-card vx-card-entry has-click" @click="handle">
    <div class="com-cell vx-card-logo">
      <slot name="logo">
        <div></div>
      </slot>
    </div>
    <div class="com-cell vx-card-main">
      <div class="card-title">
        <slot name="title">{{m.title}}</slot>
      </div>
      <div class="card-content">
        <slot name="content">
          <label v-html="m.content"></label>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object],
        default: () => { return {} }
      }
    },
    methods: {
      handle() {
        this.$emit('click', this.message)
      }
    }
  }

</script>
<style lang="scss">
  @import "~scss/_mixin";
  .vx-card-entry {
    .com-cell {
      vertical-align: middle;
    }
    .vx-card-logo {
      width: rem(160);
      padding: rem(0) nth($padding, 3) !important;
      div {
        width: rem(160);
        height: rem(80);
        background: nth($background, 1);
      }
    }
    .vx-card-main {
      padding-right: nth($padding, 3) !important;
      text-align: left;
      .card-title {
        @include fh(95%);
        line-height: rem(25);
      }
      .card-content {
        label {
          @include lh(2);
          font-size: rem(12);
          color: nth($font-color, 7);
        }
      }
    }
  }

</style>
