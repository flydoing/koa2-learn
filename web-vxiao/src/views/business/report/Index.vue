<template>
  <AppPage title="使用报告"
        :loading="loading">
    <AppCommon :app="curApp" />
  </AppPage>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        loading: false,
        app: { name: '活跃', type: '10000' }
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    }
  }
</script>
