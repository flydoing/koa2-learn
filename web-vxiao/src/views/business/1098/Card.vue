<template>
  <Card :message="message" @update="modifyMessage">
    <div slot="title" v-if="message.title" v-html="message.title"></div>
    <CardHref v-if="message.extensionType" content="查看详情" @click="handleDetail" />
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
          name: 'detail1068',
          params: {
            msgId: this.message.id
          }
        })
      },
      modifyMessage(m) {
        this.$emit('update', m)
      }
    }
  }

</script>
