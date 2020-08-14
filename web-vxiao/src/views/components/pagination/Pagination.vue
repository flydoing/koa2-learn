<template>
  <scroller :height="height">
    <Pa @click="loadMore" :hasMore="hasMore">
      <slot></slot>
    </Pa>
  </scroller>
</template>
<script>
  export default {
    components: {
      Pa: resolve => require(['./Index'], resolve)
    },
    props: {
      height: { type: String, default: '200' },
      hasMore: { type: Boolean, default: true }
    },
    methods: {
      loadMore(currentIndex) {
        this.$emit('click', currentIndex)
      }
    }
  }

</script>
<style lang="scss">
  @import "~scss/_mixin";
  .pagination-more {
    height: rem(35);
    line-height: rem(35);
    text-align: center;
    @include fs($font-small);
    &.is-click:hover {
      background: nth($background, 2);
    }
  }

</style>
