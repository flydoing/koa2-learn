<template>
  <Card :message="message">
    <CardHref content="查看详情" @click="handleDetail" />
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
        let m = this.message
        this.routePushModel({
          path: `/vx/group/business/report/message/detail/1`,
          query: {
            appType: m.type,
            appName: m.businessName,
            fromUserId: this.userId,
            msgId: m.id,
            groupId: m.groupId,
            noTempletReport: 1
          }
        })
      }
    }
  }

</script>
