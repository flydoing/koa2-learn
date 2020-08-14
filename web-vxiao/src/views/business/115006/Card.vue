<template>
  <Card :message="message"
        :parentType="1150">
    <CardHref content="查看详情"
              @click="handleDetail" />
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
      handleDetail() {
        this.routePush({
          name: 'detail1150',
          query: {
            msgId: this.message.id,
            appType: this.message.type
          }
        })
      }
    }
  }
</script>
