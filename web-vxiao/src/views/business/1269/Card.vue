<template>
  <Card :message="message">
    <CardContent slot="content"
                 :content="message.content">
      <div v-html="message.title"></div>
    </CardContent>
    <CardHref content="进入课堂"
              @click="handleHrefDetail" />
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
      handleHrefDetail() {
        this.routePushModel({
          name: 'detailIndex1269',
          query: {
            msgId: this.message.id,
            fromUserId: Number(this.message.fromUserId)
          }
        })
      },
      handleHref() {}
    }
  }
</script>
