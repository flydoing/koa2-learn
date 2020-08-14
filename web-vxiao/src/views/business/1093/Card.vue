<template>
  <Card :message="message">
    <CardHref v-if="isAdmin || isCreator"
              content="查看详情"
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
    computed: {
      isCreator() {
        let flag = false
        let users = this.message.toUsers || []
        users.forEach(u => {
          if ((u.type === 'creator' || u.type === 'to') && u.userId === this.userId) {
            flag = true
          }
        })
        return flag
      }
    },
    methods: {
      handleDetail() {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1093',
            groupId: this.groupId,
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
