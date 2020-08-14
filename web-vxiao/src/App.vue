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
  @import '~scss/common';
  .card-content {
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
