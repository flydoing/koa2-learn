<template>
  <Card :message="message"
        :parentType="1058">
    <CardHref slot="href"
              content="查看详情"
              @click="handleDetail" />
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
        let remark = this.message.remark ? this.message.remark : null
        let users = remark && JSON.parse(remark).users ? JSON.parse(remark).users : []
        // 如果该账号下绑定的用户数量大于1，这跳转到用户列表
        if (users.length > 1) {
          this.routePushModel({
            name: 'childrenList1058',
            query: {
              msgId: this.message.id
            }
          })
        } else {
          this.routePushModel({
            // path: `/vx/group/business/1058/Detail/${this.message.id}`,
            name: 'detailMenuList1058',
            query: {
              userId: this.userId,
              msgId: this.message.id
            }
          })
        }
      }
    }
  }
</script>
