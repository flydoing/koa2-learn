<template>
  <Card :message="message">
    <div slot="title">栏目：{{message.categoryName}}</div>
    <div slot="title">标题：{{message.title}}</div>
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
      this.routePushModel({
        name: 'cardDetail',
        params: { msgId: this.message.id },
        query: { type: this.message.type }
      })
    }
  }
}

</script>
