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
        this.routePush({
          path: '/vx/group/business/1079/detail',
          query: {
            aid: this.message.id
          }
        })
      }
    }
  }
</script>
