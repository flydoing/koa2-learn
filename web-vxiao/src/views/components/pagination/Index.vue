<template>
  <div class="pagination-body">
    <slot></slot>
    <div class='pagination-more' @click="loadMore" :class="{'is-click':hasMore}">
      {{text}}
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      hasMore: { type: Boolean, default: true }
    },
    data() {
      return {
        currentIndex: 1,
        textType: this.hasMore ? 1 : 0
      }
    },
    computed: {
      text() {
        if (this.textType === 0) { return '没有更多了' }
        if (this.textType === 1) { return '加载更多' }
        if (this.textType === 2) { return '加载中...' }
      }
    },
    methods: {
      loadMore() {
        if (this.textType === 1) {
          this.textType = 2
          this.currentIndex = this.currentIndex + 1
          this.$emit('click', this.currentIndex)
        }
      }
    },
    watch: {
      hasMore(t) {
        this.hasMore = t
        this.textType = t ? 1 : 0
      }
    }
  }

</script>
<style lang="scss" scoped>
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
