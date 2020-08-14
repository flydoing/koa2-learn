<template>
  <Card :message="message"
        parentType="1216">
    <CardDown slot="down"
              v-if="!message.isInterface"
              :m="message">
      <el-dropdown-item v-if="message.fromUserId===userId"
                        @click.native.stop="handleEdit">编辑</el-dropdown-item>
    </CardDown>
    <CardHref content="查看详情"
              @click="handleDetail" />
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
      handleDetail() {
        this.routePushModel({
          name: 'detail121601',
          params: {
            msgId: this.message.id
          },
          query: {
            pId: this.message.categoryId,
            uId: this.message.fromUserId
          }
        })
      },
      handleEdit() {
        this.routePushModel({
          name: 'inspectionEdit1216',
          query: {
            pId: this.message.categoryId,
            msgId: this.message.id,
            uId: this.message.fromUserId
          }
        })
      }
    }
  }
</script>
