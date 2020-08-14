<template>
  <iframe :src="pageUrl"
          ref="_webView"
          frameborder="0"
          @load="changeFrameHeight"
          scrolling="auto"></iframe>
</template>
<script>
import '@/utils/string'
export default {
  props: {
    pageUrl: String
  },
  methods: {
    changeFrameHeight() {
      const ifm = this.$refs._webView
      let dom = document.querySelector('.vx-model-middle')
      ifm.height = dom.getBoundingClientRect().height
    }
  }
}
</script>
<style lang="scss">
  iframe {
    border: 0;
    width: 100%;
    min-height: 540px;
  }
</style>
