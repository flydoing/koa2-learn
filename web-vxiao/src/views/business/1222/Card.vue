<template>
  <Card :message="message">
    <CardHref v-if="button"
              :content="button.text"
              @click="button.handle" />
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
      button() {
        return {
          text: this.isSchool || this.message.readed === 1 ? '查看详情' : '开始总结',
          handle: this.handleSummary
        }
      }
    },
    methods: {
      handleSummary() {
        if (this.isSchool) {
          this.routePushModel({
            name: 'reportDetail',
            params: {
              groupId: this.message.groupId
            },
            query: {
              appType: '1222',
              fromUserId: this.userId,
              appName: this.message.businessName,
              msgId: this.message.id
            }
          })
        } else {
          this.routePushModel({
            name: 'objects1222',
            params: {
              msgId: this.message.id
            },
            query: {
              readed: this.message.readed
            }
          })
        }
      }
    }
  }
</script>
