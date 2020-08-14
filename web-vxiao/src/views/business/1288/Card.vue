<template>
  <!-- <Card :message="message"
        :parentType="1288">

    <CardHref slot="href"
              content="查看详情"
              @click="handleDetail" />
  </Card> -->
  <child-card v-if="childMessage"
              :message="childMessage"></child-card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import R from '@/views/group/mixin'
  export default {
    mixins: [CardMixin, R],
    props: {
      message: {
        type: [Object]
      }
    },
    components: {
      ChildCard: resolve => require(['@/views/business/1288/ChildCard'], resolve)
    },
    computed: {
      childMessage() {
        return this.message.children ? { ...this.message.children[0] } : null
      }
    },
    methods: {
      // handleDetail() {
      //   this.setStorage('_report_detail_refresh', true)
      //   this.routePush({
      //     name: 'reportDetail',
      //     params: {
      //       groupId: this.groupId
      //     },
      //     query: {
      //       appType: this.message.type,
      //       fromUserId: this.userId,
      //       appName: this.message.businessName,
      //       startDate: this.message.extension,
      //       endDate: this.message.extension,
      //       timeType: 1
      //       // ...item.params
      //     }
      //   })
      //   // this.routePush({
      //   //   name: `1288/reportDetail`,
      //   //   query: {
      //   //     noTempletReport: 1,
      //   //     appType: this.message.type,
      //   //     fromUserId: this.userId,
      //   //     appName: this.message.businessName,
      //   //     date: this.message.extension,
      //   //     reportDate: this.message.content
      //   //   }
      //   // })
      // }
    }
  }
</script>
