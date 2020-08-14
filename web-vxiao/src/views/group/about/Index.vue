<template>
  <Scroller :height="sh"
            style="background:#FFF;">
    <Course v-if="isCourse" />
    <School v-else-if="isOrg" />
    <Default v-else />
  </Scroller>
</template>
<script>
  import R from '../mixin'
  export default {
    mixins: [R],
    components: {
      Default: resolve => require(['./Default'], resolve),
      School: resolve => require(['./School'], resolve),
      Course: resolve => require(['./Course'], resolve)
    },
    computed: {
      sh() {
        return this.innerHeight - 75 - 40 - 10
      }
    }
  }
</script>
