<template>
  <Card :message="message">
    <CardHref slot="href" v-if="button" :content="button.text" @click="button.handle"></CardHref>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import { mapActions } from 'vuex'

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
            text: (r === 0 ? '立即打卡' : (r === 1 ? '查看详情' : this.message.remark)),
            handle: this.handleDetail
          }
        }
        return btn
      }
    },
    methods: {
      ...mapActions(['setPunchClock']),
      handleDetail() {
        this.setPunchClock({ readed: this.message.readed })
        this.routePushModel({
          name: 'detail1255',
          query: {
            msgId: this.message.id,
            date: this.message.extension
          }
        })
      }
    }
  }

</script>
