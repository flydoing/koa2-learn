<template>
  <cardDetail :m="message" v-if="message">
    <Card1159 :message="message" :showReply="false" style="min-height: 30px;"></Card1159>
  </cardDetail>
</template>
<script>
  import Api from '@/api/message'
  export default {
    components: {
      CardDetail: resolve => require(['@/views/components/card/CardDetail'], resolve),
      Card1159: resolve => require(['@/views/business/1159/Card'], resolve)
    },
    data() {
      return {
        message: null
      }
    },
    created() {
      Api.getMessageById(this.routeParam('msgId')).then(res => {
        this.message = res.message
      })
    }
  }

</script>
