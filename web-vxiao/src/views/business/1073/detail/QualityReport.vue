<template>
  <Page title="课堂教学质量报告">
    <label slot="btn"
           @click="onDownload">下载</label>
    <web-view :pageUrl="url"></web-view>
  </Page>
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
      this.url = `/papers/qualityReport/index?userId=${this.userId}&msgId=${this.routeQuery('msgId')}`
      // this.url = `/business/classroom/query/quality/report/${this.userId}/${this.routeQuery('msgId')}`
    },
    methods: {
      onDownload() {
        this.openBrowser(`/business/classroom/download/quality/report/${this.userId}/${this.routeQuery('msgId')}`)
      }
    }
  }
</script>
