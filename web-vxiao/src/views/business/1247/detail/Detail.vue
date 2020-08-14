<template>
    <cardDetail :m="message" v-if="message"></cardDetail>
</template>
<script>
  import MsgApi from '@/api/message'
  export default {
    components: {
      CardDetail: resolve => require(['@/views/components/card/CardDetail'], resolve)
    },
    data() {
      return {
        message: null
      }
    },
    created() {
      MsgApi.getMessageById(this.routeParam('msgId')).then(res => {
        this.message = res.message
      })
    }
  }

</script>
