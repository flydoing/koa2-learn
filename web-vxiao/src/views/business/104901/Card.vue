<template>
  <Card :message="message"
        :parentType="1049">
    <CardHref content="查看详情"
              @click='handleDetail' />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      })
    },
    methods: {
      ...mapActions(['setRating']),
      handleDetail() {
        this.setRating({ isExpire: this.message.remark === '1' })
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1049',
            groupId: this.currentGroup.groupId,
            sDate: this.message.extension,
            title: '评比详情'
          }
        })
      }
    }
  }
</script>
