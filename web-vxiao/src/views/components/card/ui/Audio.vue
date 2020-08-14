<template>
  <div class="audio-box" v-if="audios.length>0">
    <div class="card-audio" v-if="audios.length>0" v-for="(audio, i) in audios" :key="i">
      <div class="card-audio-bar" :style="getWidth(audio)" @click.stop="clickAudio(i)" :class="{'bg': audio.play}">
        <img v-lazy="{src:defaultPic}" alt="" />
      </div>
      <div class="card-audio-second">{{~~(audio.size / 1000)}}"</div>
    </div>
    <!-- <audio :src="url" class="audio" ref="player" autoplay="autoplay"></audio> -->
    <audio controls class="audio" ref="player" autoplay="autoplay">
      <source :src="audioSrc" type="audio/ogg">
      <source :src="audioSrc" type="audio/mpeg">
      <source :src="audioSrc" type="audio/wav"> 您的浏览器不支持 audio 元素。
    </audio>
  </div>
</template>
<script>
  export default {
    props: {
      audios: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        audioSrc: '',
        defaultPic: '/static/ico/icon_voice_review.png'
      }
    },
    methods: {
      getWidth(audio) {
        let tt = audio / 1000
        let maxLength = 100
        let len = 50
        if (tt >= 0 && tt <= 10) {
          len = maxLength * (25 / 100 + tt / 10)
        } else if (tt > 10 && tt <= 60) {
          len = maxLength * (50 / 100 + tt / 50)
        } else if (tt > 60) {
          len = maxLength + maxLength * (tt / 600) / 100
        }
        return `width:${len}px`
      },
      clickAudio(i) {
        this.audioSrc = ''
        if (this.audios[i].extension === 'mp3' || this.audios[i].extension === 'ogg' || this.audios[i].extension === 'wav') {
          this.audioSrc = this.url(this.audios[i].fileId)
          this.defaultPic = '/static/ico/icon_voice_review_press_gif.gif'
          this.$set(this.audios[i], 'play', 1)
          this.$refs.player.play()
          setTimeout(() => {
            this.defaultPic = '/static/ico/icon_voice_review.png'
            this.$set(this.audios[i], 'play', 0)
          }, ~~(this.audios[i].size / 1000) * 1000)
        } else {
          this.$message({
            type: 'warning',
            message: `浏览器不支持"${this.audios[i].extension}"类型的音频`
          })
        }
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .audio-box {
    margin: rem(10) 0;
    .card-audio {
      @include flex;
      margin-bottom: rem(5);
      &-bar {
        max-width: rem(100);
        height: rem(40);
        background-color: #e8fcee;
        border-radius: rem(3);
        cursor: pointer;
        img {
          padding-top: rem(10);
          padding-left: rem(10);
        }
        &.bg {
          background-color: #83dea3;
        }
      }
      &-second {
        height: rem(20);
        margin-left: rem(10);
        line-height: rem(40);
        font-size: rem(14);
        color: #9f9f9f;
      }
    }

    .audio {
      display: none;
    }
  }

</style>
