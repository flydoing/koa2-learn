<template>
  <Card :message="message">
    <CardHref content="查看详情"
              @click="detailHandle" />
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
      detailHandle() {
        let url = this.message.extensionType
        let evId = url.substring(url.indexOf('evaluationId='))
        this.routePush({
          name: 'objects1127',
          query: { evId: evId }
        })
      }
    }
  }
</script>
