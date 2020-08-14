<template>
  <Card :message="message">
    <CardHref content="查看详情"
              @click="handleHrefDetail" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    methods: {
      handleHrefDetail() {
        if (this.message.remark === '1') {
          this.routePushModel({
            name: 'classList1123',
            query: {
              msgId: this.message.id
            }
          })
        } else {
          this.routePushModel({
            name: 'detail1123',
            query: {
              appType: this.message.type,
              msgId: this.message.id
            }
          })
        }
      }
    }
  }
</script>
