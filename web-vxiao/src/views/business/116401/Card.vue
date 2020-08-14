<template>
  <Card :message="message"
        :parentType="1164">
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
        let m = this.message
        if (m.msgType === '1') {
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
        } else {
          this.routePushModel({
            name: 'detail116401',
            params: { msgId: m.id },
            query: { type: m.msgType }
          })
        }
      }
    }
  }
</script>
