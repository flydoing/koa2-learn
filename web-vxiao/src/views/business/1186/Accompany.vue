<template>
  <page title="选择伴奏"
        @scrollEnd="scrollEnd"
        listenBack
        @back="back">
    <item v-for="(audio, a) in audios"
          :key="a"
          @click="handleAudio(audio)">
      <div slot="main">{{audio.fileName}}</div>
      <div slot="remark">
        <span v-if="audio.size>0"
              class="listen-btn"
              @click.stop="handlePlay(audio)">试听</span>
      </div>
    </item>
    <audio :src="audioFileId"
           v-show="false"
           ref="aud"></audio>
  </page>
</template>
<script>
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return {
        audios: [],
        hasNextPage: 0,
        currentPage: 1,
        audioFileId: ''
      }
    },
    computed: {
      ...mapGetters({
        chant: 'getChant'
      })
    },
    created() {
      this.loadAudios()
    },
    methods: {
      ...mapActions(['setChant']),
      handlePlay(obj) {
        const that = this
        this.audioFileId = ''
        this.audioFileId = this.url(obj.fileId)
        setTimeout(function() {
          that.$refs.aud.play()
        })
      },
      loadAudios() {
        Api.getAudioList(this.currentPage).then(res => {
          if (res.code === '1') {
            if (res.hasNextPage > 0) {
              this.hasNextPage = res.hasNextPage
              this.currentPageNum = res.currentPage
            } else {
              this.hasNextPage = 0
            }
          }
          if (res.medias) {
            this.audios = [...this.audios, ...res.medias]
          }
        })
      },
      scrollEnd() {
        this.hasNextPage > 0 && this.loadAudios()
      },
      back() {
        this.$refs.aud.pause()
        this.routeBack()
      },
      handleAudio(audio) {
        this.$refs.aud.pause()
        this.setChant({ audio: audio })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .listen-btn {
    @include fc;
  }
</style>
