<template>
  <Page title="运动">
    <WebView :pageUrl="pageUrl"></WebView>
  </Page>
</template>
<script>
  export default {
    components: {
      WebView: resolve => require(['@/views/html5/WebView'], resolve)
    },
    data() {
      return { pageUrl: '' }
    },
    created() {
      this.pageUrl = `/html5/pages/1218/vbracelet/${this.routeParam('userId')}`
    }
  }
</script>
