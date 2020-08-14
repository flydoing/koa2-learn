<template>
  <scroller :height="h">
    <CardBrief :message="message" v-if="message"></CardBrief>
  </scroller>
</template>
<script>
  import Api from './api'
  export default {
    components: {
      CardBrief: resolve => require(['./CardBrief'], resolve)
    },
    data() {
      return {
        message: null
      }
    },
    created() {
      Api.getTheMsg(this.routeQuery('msgId')).then(res => {
        if (res && res.code === '1') {
          this.message = res.message
        }
      })
    }
  }

</script>
