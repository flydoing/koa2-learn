<template>
  <Card :message="message">
    <CardHref slot="category" :content="message.categoryName" />
    <CardHref slot="href" content="查看详情" @click="handleDetail" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    methods: {
      handleDetail() {
        this.routePushModel({
          name: 'gradeDetail1003',
          query: {
            msgId: this.message.id
          }
        })
      }
    }
  }

</script>
