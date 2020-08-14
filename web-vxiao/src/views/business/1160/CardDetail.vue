<template>
  <cardDetail :m="message" v-if="message">
    <CardColumn :message="message" :pd="true">
      <template slot="down"></template>
    </CardColumn>
  </cardDetail>
</template>
<script>
  import Api from '@/api/message'
  export default {
    components: {
      CardDetail: resolve => require(['@/views/components/card/CardDetail'], resolve),
      CardColumn: resolve => require(['@/views/components/card/CardColumn'], resolve)
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
