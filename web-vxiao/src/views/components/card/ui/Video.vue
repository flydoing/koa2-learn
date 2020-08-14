<template>
  <div class='video-box'
       v-lazy:background-image="coverUrl"
       :style="imageStyle"
       v-if="video">
    <div class='vb-bg'>
      <a class='vb-title'
         @click="handleVideo">
        <span v-html="video.fileName"></span>
        <span class="vb-download-count"
              v-if="video.downLoadCount">观看&nbsp;{{video.downLoadCount}}</span>
        <!-- <i class='ico ico-download'></i> -->
      </a>
    </div>
    <div class='vb-play'
         @click="handlePlay"></div>
    <Player :playerUrl="playerUrl"
            :cover="coverUrl"
            :fileId="video.fileId"
            :show.sync="showPlayer"></Player>
  </div>
</template>
<script>
export default {
  props: {
    video: { type: Object }
  },
  components: {
    Player: resolve => require(['@/views/components/video/Player'], resolve)
  },
  computed: {
    playerUrl() {
      return `/commons/file/${this.video.fileId}`
    },
    coverUrl() {
      let cover = this.video.remark
      let baseUrl = this.baseInfo.BUSINESS_URL
      return cover ? `${baseUrl}/commons/file/${cover}` : `${baseUrl}/static/default_video.png`
    }
  },
  data() {
    return {
      showPlayer: false
    }
  },
  methods: {
    handleVideo() {
      this.openBrowser(this.playerUrl)
    },
    handlePlay() {
      this.showPlayer = true
    }
  }
}
</script>
<style lang="scss">
  @import '~scss/mixin';

  .video-box {
    margin-top: rem(8);
    width: rem(300);
    height: rem(150);
    background-size: cover;
    position: relative;

    .vb-play {
      width: rem(50);
      height: rem(50);
      position: absolute;
      left: 50%;
      top: 40%;
      margin-top: rem(-25);
      margin-left: rem(-25);
      background: url('/static/play.png') no-repeat center;
      cursor: pointer;
    }

    .vb-bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.4);
    }

    .vb-title {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      width: 100%;
      line-height: rem(35);
      background-color: rgba(0, 0, 0, 0.49);
      cursor: pointer;
      display: block;

      .vb-download-count {
        float: right;
        font-size: rem(12);
        margin-right: rem(8);
      }

      span:first-child {
        padding-left: rem(8);
        width: rem(220);
        display: block;
        overflow: hidden;
        margin: 0;
        font-size: rem(14);
        text-overflow: ellipsis;
        white-space: nowrap;
        float: left;
      }
    }
  }
</style>
