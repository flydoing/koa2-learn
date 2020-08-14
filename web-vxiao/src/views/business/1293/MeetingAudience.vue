<template>
  <!-- <page :title="title"
        :loadind="loading"
        @back="handleBack"
        listenBack>
    <div class="meeting-audience"
         v-if="isDataReady">
      <WebView :pageUrl="pageUrl"></WebView>
    </div>
  </page> -->
  <div class="meeting-audience"
       v-if="isDataReady">
    <WebView :pageUrl="pageUrl"></WebView>
  </div>
</template>
<script>
import R from '@/views/group/mixin'
import MixinMessage from '@/views/group/mixinMessage'
import Api from './api'
export default {
  mixins: [R, MixinMessage],
  components: {
    WebView: resolve => require(['@/views/html5/WebView'], resolve)
  },
  data() {
    return {
      title: '观众视图',
      loading: true,
      isDataReady: false,
      pageUrl: '',
      userSig: {
        appId: '',
        userId: '',
        userSig: ''
      },
      groupId: '',
      meetingTitle: '',
      fromUserId: '',
      roomid: '' // 消息的：originalId或消息id
    }
  },
  created() {
    // 腾讯WebRTCAPI报错：由于浏览器安全限制，获取/枚举音视频设备接口必须在https域名或localhost下访问
    if (window.location.protocol !== 'https:') {
      this.$message({ message: '请用https:打开访问视频会议', type: 'warning' })
    }
    this.groupId = this.routeQuery('groupId')
    this.meetingTitle = this.routeQuery('meetingTitle')
    this.fromUserId = this.routeQuery('fromUserId')
    this.roomid = this.routeQuery('roomid')
    this.getVideoConferenceConfig()
  },
  methods: {
    getVideoConferenceConfig() {
      Api.getVideoConferenceConfig(this.groupId).then(res => {
        if (res.code === '1') {
          this.userSig = res.userSig
          // 组装iframe链接: 需要在https打开（腾讯SDK的WebRTCAPI）
          this.pageUrl = `/papers/video/desktop?appId=${this.userSig.appId}&userId=${this.userSig.userId}&roomid=${this.roomid}&userSig=${
            this.userSig.userSig
          }&meetingTitle=${this.meetingTitle}&fromUserId=${this.fromUserId}`
          this.isDataReady = true
          this.loading = false
        }
        if (!this.userSig.appId) {
          this.$message({ message: '缺失参数配置', type: 'warning' })
        }
      })
    },
    handleBack() {
      this.routeBack()
    }
  }
}
</script>
<style lang="scss">
  .overlay-body {
    margin-top: 0 !important;
  }
  .vx-model {
    min-height: 500px;
    overflow: auto;
  }
  .popRecording {
    overflow: auto;
  }
</style>
