<template>
  <Card :message="message">
    <CardHref slot="href" v-if="button" :content="button.text" @click="button.handle"></CardHref>
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
        let btn = null
        let r = this.message.readed
        if (r !== undefined) {
          btn = {
            text: (r === 0 ? '立即接龙' : (r === 1 ? '查看详情' : this.message.remark)),
            handle: this.handleDetail
          }
        }
        return btn
      }
    },
    methods: {
      handleDetail() {
        let m = this.message
        if (m.readed === 0) {
          if (m.msgType !== '1') {
            this.routePushModel({
              name: 'answerQuestion1257',
              query: {
                msgId: this.message.id
              }
            })
          } else {
            this.routePushModel({
              name: 'addContent1257',
              query: {
                msgId: this.message.id
              }
            })
          }
        } else {
          this.routePushModel({
            name: 'detail1257',
            query: {
              msgId: this.message.id
            }
          })
        }
      }
    }
  }

</script>
