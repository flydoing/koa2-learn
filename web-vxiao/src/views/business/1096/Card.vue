<template>
  <Card :message="msg">
    <CardHref content="查看详情"
              @click="handleDetail" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'

  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    data() {
      return {
        msg: this.message
      }
    },
    computed: {},
    methods: {
      handleDetail() {
        let mJson = this.message.msgJson ? JSON.parse(this.message.msgJson) : {}
        this.routePushModel({
          name: 'detail1096',
          query: { pId: mJson.id }
        })
      }
    }
  }
</script>
