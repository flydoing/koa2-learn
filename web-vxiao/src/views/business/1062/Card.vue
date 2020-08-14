<template>
  <Card :message="message">
    <div slot="title"
         class="card-content"
         v-html="m.title"></div>
    <CardHref content="查看详情"
              @click="detailHandle" />
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
    methods: {
      ...mapActions(['setCrm']),
      detailHandle() {
        let mJson = JSON.parse(this.message.msgJson || '{}')
        this.setCrm({ isCreate: false })
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1062',
            groupId: this.groupId,
            cid: mJson.clients[0].id
          }
        })
      }
    }
  }
</script>
