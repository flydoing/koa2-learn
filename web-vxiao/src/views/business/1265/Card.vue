<template>
  <Card :message="message">
    <div slot="title">{{message.title}}</div>
    <CardHref content="查看详情"
              @click="handle" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    methods: {
      handle() {
        // 创建人查看详情
        if (this.message.msgType === '1') {
          this.routePushModel({
            path: '/vx/group/business/1265/detail/school',
            query: {
              groupId: this.groupId,
              msgId: this.message.id,
              isClass: this.isClass
            }
          })
        } else {
          this.routePushModel({
            path: '/vx/group/business/1265/detail/parent',
            query: {
              groupId: this.groupId,
              msgId: this.message.id,
              total: this.message.msgJson
            }
          })
        }
      }
    }
  }
</script>
