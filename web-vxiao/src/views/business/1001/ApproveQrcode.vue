<template>
  <page title="立即审批">
    <div class="approve-qrcode">
      <div>需电子签名，用V校APP或微信扫一扫</div>
      <img v-lazy="{src: qrcode}" />
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    data() {
      return {
        qrcode: ''
      }
    },
    created() {
      let msgId = this.routeQuery('msgId')
      let appType = this.routeQuery('appType')
      this.qrcode = `/business/approve/qrcode/${appType}/${msgId}`
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>
  .approve-qrcode {
    & > div {
      padding: rem(30) 0;
      text-align: center;
    }
    img {
      width: rem(300);
      height: rem(300);
      display: block;
      margin: 0 auto;
    }
  }
</style>
