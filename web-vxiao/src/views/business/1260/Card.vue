<template>
  <Card :message="message">
    <CardHref v-if="button"
              slot="href"
              :content="button.text"
              @click="button.handle"></CardHref>
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
            text: r === 0 ? '立即反馈' : r === 1 ? '查看详情' : `已反馈${this.message.remark || 0}人`,
            handle: this.handleDetail
          }
        }
        return btn
      }
    },
    methods: {
      ...mapActions(['setHomeVisit', 'deleteHomeVisitProp']),
      handleDetail() {
        if (this.isTeacher) {
          this.deleteHomeVisitProp('message')
          this.routePushModel({
            name: 'detail1260',
            query: {
              msgId: this.message.id
            }
          })
        } else {
          this.setHomeVisit({ message: this.message })
          this.deleteHomeVisitProp('record')
          this.routePushModel({
            name: 'feedback1260',
            query: {
              msgId: this.message.id
            }
          })
        }
      }
    }
  }
</script>
