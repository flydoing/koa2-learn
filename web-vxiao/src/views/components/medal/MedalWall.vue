<template>
  <div class="medal-wall">
    <Medal v-for="(medal,i) in list"
           :key="i"
           :medal="medal"
           @click="handle(medal, i)"
           :isActive="medal.active"></Medal>
    <slot></slot>
  </div>
</template>
<script>
  import Check from '@/utils/check'

  export default {
    name: 'item',
    props: {
      list: { type: [Array] },
      medalClick: { type: [Function] }
    },
    created() {},
    components: {
      Medal: resolve => require(['@/views/components/medal/Medal'], resolve)
    },
    methods: {
      handle(medal, index) {
        if (Check.isFunction(this.medalClick)) {
          this.medalClick(medal, index)
        }
      }
    }
  }
</script>
<style lang="scss">
  .medal-wall {
    @extend %clearfix;
    padding-top: rem(14);
  }
</style>
