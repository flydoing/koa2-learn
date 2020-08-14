<template>
  <Card :message="message"
        :parentType="1288">
    <CardHref content="查看详情"
              @click='handleDetail' />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import R from '@/views/group/mixin'
  export default {
    mixins: [CardMixin, R],
    props: {
      message: { type: [Object] }
    },
    methods: {
      handleDetail() {
        this.setStorage('_report_detail_refresh', true)
        this.routePush({
          name: 'reportDetail',
          params: {
            groupId: this.groupId
          },
          query: {
            appType: '1288',
            fromUserId: this.userId,
            appName: this.message.businessName,
            startDate: this.message.extension,
            endDate: this.message.extension,
            timeType: 1
          }
        })
      }
    }
  }
</script>
