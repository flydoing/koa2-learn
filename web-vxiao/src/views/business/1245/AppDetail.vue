<template>
  <AppPage title="成长果园">
    <AppCommon :app="curApp"
                :hasReport="false"
                :hasTemplate="false" />
  </AppPage>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    created() {},
    methods: {},
    mounted() {}
  }
</script>
