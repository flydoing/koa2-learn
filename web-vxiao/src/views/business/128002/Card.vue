<template>
  <Card :message="message"
        :parentType="1280">
    <div v-lazy:background-image="coverBg(message.msgJson.cover)"
         class="live-block"
         @click="onClick(message)">
      <div class="before-icon"
           :class="{'begin':message.status==='8','end':message.status!=='8'}">
        <span>{{statusText}}</span>
      </div>
      <div class="play-icon">
        <img :src="play"
             alt="">
      </div>
    </div>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: Object
    },
    computed: {
      bg() {
        return '/static/live_.png'
      },
      statusText() {
        return this.message.status === '0' ? '转码失败' : this.message.status !== '8' ? '转码中' : '正常'
      },
      play() {
        return '/static/play.png'
      }
    },
    methods: {
      coverBg(cover) {
        return cover ? this.url(cover) : '/static/live_.png'
      },
      onClick(message) {
        if (this.message.status !== '8') {
          this.$message({ type: 'warning', message: '转码中，暂不能播放' })
        } else {
          let msgJson = JSON.parse(message.msgJson)
          // 打开链接播放MP4,webpc
          // http://m.ipipa.cn/papers/live/vplay?playMp4=https%3A%2F%2Fm.ipipa.cn%2Fweb%2F2019%2F03%2Fdfdl%2Fgzfer.mp4
          this.openBrowser(`/papers/live/vplay?playMp4=${msgJson.path}&title=精彩录播`)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .live-block {
    width: rem(354);
    height: rem(200);
    position: relative;
    margin-top: rem(5);
    cursor: pointer;
    .play-icon {
      position: absolute;
      top: 50%;
      right: 50%;
      margin-top: rem(-25);
      margin-left: rem(-25);
      width: rem(50);
      height: rem(50);
    }
    & > .before-icon {
      position: absolute;
      top: rem(5);
      right: rem(5);
      width: rem(90);
      height: rem(25);
      line-height: rem(25);
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      text-align: right;
      padding: rem(0) rem(10);
      color: #fff;
      &:before {
        content: '';
        position: absolute;
        width: rem(8);
        height: rem(8);
        border-radius: 50%;
        top: rem(9);
        left: rem(10);
        background: nth($background, 10);
      }
      &.begin:before {
        background: #26c85e;
      }
      &.end:before {
        background: #fdcb34;
      }
    }
  }
</style>
