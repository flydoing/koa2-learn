<template>
  <Card :message="message"
        :parentType="1230">
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
        this.routePushModel({
          name: 'detail1152',
          params: {
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
