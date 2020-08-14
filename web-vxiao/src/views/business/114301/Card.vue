<template>
  <Card :message="message"
        :parentType="1143">
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
          name: 'detail114301',
          query: {
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
