<template>
  <Card :message="message">
    <CardHref slot="catgory" :content="message.categoryName" @click="handleHref" v-if="message.categoryName" />
    <CardHref content="进入课堂" @click="handleHrefDetail" />
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
          name: 'detailIndex1073',
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
