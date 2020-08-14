<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  // 主入口文件
  export default {
    name: 'app',
    data() {
      return {}
    },
    beforeCreate() {},
    created() {},
    methods: {},
    computed: {},
    mounted() {},
    watch: {}
  }
</script>
<style lang="scss">
  @import '~scss/base';
  @import '~scss/table';
  @import '~scss/button';
  @import '~scss/ico';
  @import '~scss/item';
  html {
    overflow: auto !important;
  }
</style>
