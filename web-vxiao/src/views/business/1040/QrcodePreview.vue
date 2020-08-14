<template>
  <div class="qrcode-container"
       :style="{height: hght}">
    <div v-html="qrcode.title"></div>
    <img v-lazy="{src:qrcode.src}" />
  </div>
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        qrcode: {}
      }
    },
    computed: {
      hght() {
        return `${this.innerHeight}px`
      }
    },
    created() {
      this.qrcode = this.getStorage('_qrcode_cache') || {}
    },
    mounted() {
      let href = window.location.href
      console.log(href)
      if (href.indexOf('gpxyzb') > 0 || href.indexOf('gpx.html') > 0) {
        // console.log('<link rel="shortcut icon" href="/gpx_favicon.ico">')
        var links = document.getElementsByTagName('link')
        for (var i = 0; i < links.length; i++) {
          if (links[i] && links[i].rel && links[i].rel.indexOf('shortcut') !== -1) {
            console.log(links[i])
            links[i].setAttribute('href', '/gpx_favicon.ico')
          }
        }
      }
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>
  .qrcode-container {
    width: 100%;
    height: 100%;
    background: url('/static/images/bg_01.png') no-repeat #2dbe60 center;
    background-size: 100%;
    @include ct;
    @include fd;
    img {
      width: rem(442);
      height: rem(442);
      padding: rem(22);
      background: #fff;
      border-radius: rem(10);
      margin-top: rem(17);
      margin-bottom: rem(50);
    }
    div {
      text-align: center;
      font-size: rem(40);
      color: #fff;
      font-weight: lighter;
      letter-spacing: rem(1);
    }
  }
</style>
