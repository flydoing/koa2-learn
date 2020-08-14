<template>
  <Card :message="message">
    <CardHref slot="href"
              content="查看详情"
              @click="handleDetail"></CardHref>
  </Card>
</template>
<script>
import Check from '@/utils/check'
import DateUtils from '@/utils/date'
import CardMixin from '@/views/components/card/mixin'
export default {
  mixins: [CardMixin],
  props: {
    message: { type: [Object] }
  },
  methods: {
    handleDetail() {
      let m = this.message
      let startDate = ''
      if (Check.isRealArray(m.times)) {
        m.times.some(time => {
          startDate = DateUtils.format(time.setTime, 'yyyyMMdd')
          return true
        })
      }
      this.routePushModel({
        path: `/vx/group/business/report/message/detail/1`,
        query: {
          appType: m.type,
          appName: m.businessName,
          fromUserId: this.userId,
          extension: m.extension,
          groupId: m.groupId,
          msgId: m.id,
          startDate: startDate,
          noTempletReport: 1
        }
      })
    }
  }
}
</script>
