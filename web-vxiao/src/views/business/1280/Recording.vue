<template>
  <!-- <Page title="新建导播台"
        :loading="loading">
    <template>
      <WebView :pageUrl="pageUrl"></WebView>
    </template>
  </Page> -->
  <div class="popRecording">
    <WebView :pageUrl="pageUrl"></WebView>
  </div>
</template>
<script>
import R from '@/views/group/mixin'
// import Api from '@/views/business/1279/api'
// import Check from '@/utils/check'
export default {
  mixins: [R],
  components: {
    WebView: resolve => require(['@/views/html5/WebView'], resolve)
  },
  data() {
    return {
      pageUrl: `/papers/recording/desktop`,
      loading: true,
      places: [],
      categorys: {},
      isTip: false
    }
  },
  created() {
    let that = this
    setTimeout(function() {
      that.loading = false
    }, 5000)
    // if (this.isSchool) {
    //   Api.getVisionPlaces(this.schoolId).then(res => {
    //     this.loading = false
    //     res.visionPlaces.forEach(p => {
    //       if (!this.categorys[p.categoryName]) {
    //         this.$set(this.categorys, p.categoryName, [])
    //       }
    //       this.categorys[p.categoryName].push(p)
    //     })
    //   })
    // } else {
    //   Api.getVisionPlaceByGroupId(this.groupId).then(res => {
    //     this.loading = false
    //     if (res && Check.isRealArray(res.visionPlaces)) {
    //       this.places = res.visionPlaces
    //       this.onStart(this.places[0])
    //     } else {
    //       this.isTip = true
    //     }
    //   })
    // }
  },
  methods: {
    onStart(g) {
      this.socketSend({
        command: 'VRecordPlay',
        commandValue: '1000',
        data: {
          groupId: this.groupId,
          placeId: g.placeId,
          schoolId: g.schoolId
        }
      })
    }
  },
  watch: {
    isClose(v) {
      if (v && !this.isSchool) {
        this.routeBack()
      }
    },
    isLookSelf(v) {
      if (v) {
        this.routeBack()
      }
    }
  },
  destroyed() {
    // if (this.isLookSelf) {
    // this.routePush({
    //   path: '/vx/user/vrecord'
    // })
    // }
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
