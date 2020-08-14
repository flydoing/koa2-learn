<template>
  <page title="分享详情">
    <div class="share-detail">
      <WebView :pageUrl="uri"></WebView>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R],
    components: {
      WebView: resolve => require(['@/views/html5/WebView'], resolve)
    },
    data() {
      return {
        message: {},
        uri: ''
      }
    },
    computed: {},
    created() {
      let msgId = this.routeParam('msgId')
      MessageApi.getMessageById(msgId).then(res => {
        this.message = res.message
        // 平台拿不到tokenId ，需要web自行拼接
        let _uri = this.message.extensionType.indexOf('?') >= 0 ? `${this.message.extensionType}&` : `${this.message.extensionType}?`
        this.uri = `${_uri}userId=${this.userId}&groupId=${this.groupId}`
      })
    }
  }
</script>
