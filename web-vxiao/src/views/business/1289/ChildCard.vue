<template>
  <Card :message="message"
        :parentType="1289">
    <template v-if="message.replys">
      <div v-for="(reply,i) in message.replys"
           :key="i"
           :reply="reply">
        <template v-if="reply.fromClientId==='system'">
          {{reply.content}}&nbsp;&nbsp;
          反馈日期：{{reply.createTime}}
        </template>
      </div>
    </template>
    <CardHref content="进展反馈"
              @click='progressHandle' />

  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import R from '@/views/group/mixin'
  import dateFormat from '@/utils/date'
  export default {
    mixins: [CardMixin, R],
    props: {
      message: { type: [Object] }
    },
    created() {
      // 时间格式化
      if (this.message.replys) {
        this.message.replys.forEach(item => {
          item.createTime = dateFormat.format(item.createTime, 'yyyy-MM-dd')
        })
      }
    },
    methods: {
      progressHandle() {
        this.setStorage('_report_detail_refresh', true)
        this.routePush({
          name: '1289/progressFeedback',
          params: {
            groupId: this.groupId
          },
          query: {
            appType: '1289',
            fromUserId: this.userId,
            appName: this.message.businessName,
            startDate: this.message.extension,
            endDate: this.message.extension,
            timeType: 1,
            id: this.message.id
          }
        })
      }
    },
    watch: {
      message: {
        handler(newVal) {
          if (this.message.replys) {
            this.message.replys.forEach(item => {
              item.createTime = dateFormat.format(item.createTime, 'yyyy-MM-dd')
            })
          }
        },
        deep: true
      }
    }
  }
</script>
