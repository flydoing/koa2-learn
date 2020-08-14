<template>
  <page title="课堂教学质量报告">
    <web-view :pageUrl="url"></web-view>
  </page>
</template>
<script>
  import G from '@/views/group/mixin'
  export default {
    components: {
      WebView: resolve => require(['@/views/html5/WebView'], resolve)
    },
    mixins: [G],
    data() {
      return {
        url: null
      }
    },
    created() {
      this.url = `/business/classroom/query/quality/report/${this.userId}/${this.routeQuery('msgId')}`
    }
  }

</script>
