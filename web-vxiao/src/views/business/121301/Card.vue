<template>
  <Card :message="message"
        :parentType="1213">
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
          path: `${this.message.extensionType.replace('html5/pages', 'vx/group/business')}&fromUserId=${this.userId}&msgId=${this.message.id}`
        })
      }
    }
  }
</script>
