<template>
  <Card :message="message">
    <CardHref slot="catgory" :content="message.categoryName" @click="handleHref" v-if="message.categoryName" />
    <template slot='down'></template>
    <span slot="counter">引用{{message.collectCount || 0}}次</span>
    <CardHref v-if="showBtn" content="查看详情" @click="handleHrefDetail" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      },
      showBtn: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleHrefDetail() {
        this.routePushModel({
          name: 'teacherReview1069',
          query: {
            msgId: this.message.id
          }
        })
      }
    }
  }

</script>
